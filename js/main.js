var all_switches = {};

$(document).ready( function() {
  // get the list of switches to poll
  var switchesJSON = $
    .ajax( { url: 'switches.json', cache: false, dataType: 'json' } )
    .fail( function( e, textStatus ) {
      alert( 'Cannot find any switches\nPlease check for switches.json file.\nError: ' + textStatus );
    })
    .done( function( data ) {
      // create a section for each switch
      $('#switches').html( '<div data-role="collapsible-set" id="switches-set"></div>' );
      var menuCollapsed = ( data.switches.length > 1 ? 'true' : 'false' );
      $.each( data.switches, function( i, obj ) {
        var new_id = 'SW-' + slugify( obj.DisplayName );

        $('#switches-set').append(
          '<div data-role="collapsible" data-collapsed="' + menuCollapsed + '" id="' + new_id + '"> \
            <h3 id="colapseable-header-' + new_id + '"><span>' + new_id + '</span><img id="imgSignal-' + new_id + '" src="images/wifi_a1.png"  height="25" width="20" align="right"></h3> \
            <p id="colapseable-content-' + new_id + '"><span> \
              <div class="ui-field-contain"><label for="slider-fill'+new_id+'">Delay mins:</label> \
              <input type="range" name="slider-fill'+new_id+'" id="slider-fill-'+new_id+'" value="60" min="0" max="300"  step="15" data-highlight="true"></div> \
            </span></p><table id="infotbl-' + new_id + '"> \
            </table><table id="jobtbl-' + new_id + '"></table> \
        </div>')
          .collapsibleset().trigger( 'create' );

        all_switches[new_id] = obj;
        all_switches[new_id].id = new_id;
        setInterval( UpdateSwitchData( new_id ), 5000 );
      });
    });
});

function takeAction( url, id ) {
  if ( url.lastIndexOf( '&mins=60' ) ) {  // if the url includes mins it's a delyed action, use the value from the slider.
    var v = $( '#slider-fill-' + id ).val();
    url = url.replace( '&mins=60', '&mins=' + v );
  }
  $.getJSON( url + '&callback=?', function( result ) {
    UpdateSwitchData( id );
  });
}

function UpdateSwitchData( id ) {
  var switchMeta = all_switches[id];

  var switchinfoJSON = $
    .ajax( { url: buildActionUrl( switchMeta, '/cgi-bin/json.cgi' ), cache: false, dataType: 'jsonp' } )
    .fail( function( e, textStatus ) {
      $('#imgSignal-' + id).attr( 'src', 'images/wifi_a2.png' );
      alert( 'Unable to connect: ' + textStatus );
    })
    .done( function( data ) { // enable switch
      //add the data from the device to the array
      $.extend( switchMeta, data );

      //check the wifi signal
      var imgSig = ( 'images/' + getSignalStrengthImage( switchMeta.info.signal ) );
      $('#imgSignal-' + id).attr( 'src', imgSig );

      // show actions
      $('#colapseable-header-' + id + ' span').html( switchMeta.DisplayName );
      $('#colapseable-content-' + id + ' span').html('');
      $.each( switchMeta.links.actions, function ( key, data ) {
        var actionUrl = buildActionUrl( switchMeta, data );
        $('#colapseable-content-' + id + ' span').append( '<button class="ui-btn" id="' + id + '-action-' + key + '">' + key + '</button>' );

        $('#' + id + '-action-' + key).click( { url: actionUrl }, function( evt ) {
          takeAction( evt.data.url, id );
        });
      });

      //show network info
      $('#infotbl-' + id).empty()
        .append('<tr><td>Uptime:</td><td>' + switchMeta.info.uptime + '</td></tr>')
        .append('<tr><td>IP:</td><td>' + switchMeta.ip + '</td></tr>')
        .append('<tr><td>MAC:</td><td>' + switchMeta.info.macaddr + '</td></tr>')
        .append('<tr><td>BSID:</td><td>' + switchMeta.info.ssid + '</td></tr>')
        .append('<tr><td>Channel:</td><td>' + switchMeta.info.channel + '</td></tr>')
        .append('<tr><td>Signal:</td><td>' + switchMeta.info.signal + ' dBm</td></tr>');

      // show wifi info
      $('#right-' + id + ' span').append( '<span>' + switchMeta.info.ssid + '</span></br>' )
        .append( '<span>ch ' + switchMeta.info.channel + '</span>' );

      //update switch based on actual reported state
      $.getJSON( buildActionUrl( switchMeta, switchMeta.links.meta.state ) + '&callback=?', function( result ) {
        $('#colapseable-header-' + id + ' span').html( switchMeta.DisplayName + ' (' + result.state + ')' );
      });

      //list any scheduled jobs
      var getjobs_url = buildActionUrl( switchMeta, '/cgi-bin/json.cgi?get=jobs' );
      $('#jobtbl-' + id).empty();
      $.getJSON( getjobs_url + '&callback=?', function( result ) {
        $.each( result.jobs, function ( key, data ) {
          var action = ( ( data.queue == 'b' ) ? 'on' : 'off' );
          var cancel_url = buildActionUrl( switchMeta, '/cgi-bin/json.cgi?canceljob=' + data.jobid );
          $('#jobtbl-' + id).append( '<tr><td>' + action + '</td><td>' + data.date + '</td><td><a href="' + cancel_url + '" class="ui-btn ui-icon-delete ui-btn-icon-left " >cancel</a></td></tr>' );
        });
      });

    });
}

function getSignalStrengthImage( dBm ) {
  var wifiImages = [];
  wifiImages['none'] = 'wifi_a1.png';
  wifiImages['low'] = 'wifi_a2.png';
  wifiImages['poor'] = 'wifi_a3.png';
  wifiImages['fair'] = 'wifi_a4.png';
  wifiImages['good'] = 'wifi_a5.png';
  wifiImages['excellent'] = 'wifi_a6.png';

  dBm = Math.ceil( Math.abs( dBm ) / 10 );

  if ( dBm > 7 )
    dBm = 8;
  if ( dBm < 5)
    dBm = 4;

  var signalStrength = '';

  switch ( dBm ) {
    case 4:
      signalStrength = 'excellent';
      break;
    case 5:
      signalStrength = 'good';
      break;
    case 6:
      signalStrength = 'fair';
      break;
    case 7:
      signalStrength = 'poor';
      break;
    default:
      signalStrength = 'low';
  }

  return wifiImages[signalStrength];
}

function slugify( text ) {
  return text.toString().toLowerCase()
    .replace( /\s+/g, '-' )           // Replace spaces with -
    .replace( /[^\w\-]+/g, '' )       // Remove all non-word chars
    .replace( /--+/g, '-' )         // Replace multiple - with single -
    .replace( /^-+/, '' )             // Trim - from start of text
    .replace( /-+$/, '' );            // Trim - from end of text
}

function buildActionUrl( switchMeta, url ) {
  var base_url = switchMeta.baseUrl ? switchMeta.baseUrl : 'http://' + switchMeta.ip;
  // fix legacy links: remove http://ip part. We'll use ip instead
  if (url.startsWith( 'http://' )) {
    return url.replace( /(http:\/\/.*?)(\/.*)/, base_url + '$2' );
  } else {
    return base_url + url;
  }
}
