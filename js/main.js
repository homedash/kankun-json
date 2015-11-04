var all_switches = {};

$(document).ready( function() {
  // get the list of switches to poll
  var switchesJSON = $
    .ajax( { url: 'switches.json', cache: false, dataType: 'json' } )
    .fail( function() {
      alert( 'Cannot find any switches' );
    })
    .always( function( data ) {
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
        </div>');
        $('#switches-set').collapsibleset().trigger( 'create' );

        all_switches[new_id] = obj;
        all_switches[new_id].id = new_id;
        setInterval( UpdateSwitchData( new_id ), 5000 );
      });
    });
});

function takeAction( url, id ) {
  var param='&mins='+all_switches[id].info.countdown;
  if ( url.indexOf("mins=") > -1 ) {  // if the url includes mins it's a delyed action, use the value from the slider.
    var v = $( '#slider-fill-' + id ).val();
    url = url.replace(/mins=[0-9]+/,'&mins=' + v)
  }
  $.getJSON( url + '&callback=?', function( result ) {
    UpdateSwitchData( id );
  });
}

function UpdateSwitchData( id ) {
  ip = all_switches[id].ip;

  var switchinfoJSON = $
    .ajax( { url: 'http://' + ip + '/cgi-bin/json.cgi', cache: false, dataType: 'jsonp' } )
    .fail( function() {
      $('#imgSignal-' + id).attr( 'src', 'images/wifi_a2.png' );
      alert( 'Cannot contact' );
    })
    .done( function( data ) { // enable switch
      //add the data from the device to the array
      $.extend( all_switches[id], data );

      //check the wifi signal
      var imgSig = ( 'images/' + getSignalStrengthImage( all_switches[id].info.signal ) );
      $('#imgSignal-' + id).attr( 'src', imgSig );

      // show actions
      $('#colapseable-header-' + id + ' span').html( all_switches[id].DisplayName );
      $('#colapseable-content-' + id + ' span').html('');
      $.each( all_switches[id].links.actions, function ( key, data ) {
        $('#colapseable-content-' + id + ' span').append( '<button class="ui-btn" id="' + id + '-action-' + key + '">' + key + '</button>' );

        $('#' + id + '-action-' + key).click( { url: data }, function( evt ) {
          takeAction( evt.data.url, id );
        });
      });

      //update lsider value based on data from switch
      $('#slider-fill-'+id).val(all_switches[id].info.countdown);
      $('#slider-fill-'+id).slider('refresh');

      //show network info
      $('#infotbl-' + id).empty();
      $('#infotbl-' + id).append( '<tr><td>Uptime:</td><td>' + all_switches[id].info.uptime + '</td></tr>' );
      $('#infotbl-' + id).append( '<tr><td>IP:</td><td>' + all_switches[id].ip + '</td></tr>' );
      $('#infotbl-' + id).append( '<tr><td>MAC:</td><td>' + all_switches[id].info.macaddr + '</td></tr>' );
      $('#infotbl-' + id).append( '<tr><td>BSID:</td><td>' + all_switches[id].info.ssid + '</td></tr>' );
      $('#infotbl-' + id).append( '<tr><td>Channel:</td><td>' + all_switches[id].info.channel + '</td></tr>' );
      $('#infotbl-' + id).append( '<tr><td>Signal:</td><td>' + all_switches[id].info.signal + ' dBm</td></tr>' );

      // show wifi info
      $('#right-' + id + ' span').append( '<span>' + all_switches[id].info.ssid + '</span></br>' );
      $('#right-' + id + ' span').append( '<span>ch ' + all_switches[id].info.channel + '</span>' );

      //update switch based on actual reported state
      $.getJSON( all_switches[id].links.meta.state + '&callback=?', function( result ) {
        $('#colapseable-header-' + id + ' span').html( all_switches[id].DisplayName + ' (' + result.state + ')' );
      });

      //list any scheduled jobs
      var getjobs_url = 'http://' + ip + '/cgi-bin/json.cgi?get=jobs';
      $('#jobtbl-' + id).empty();
      $.getJSON( getjobs_url + '&callback=?', function( result ) {
        $.each( result.jobs, function ( key, data ) {
          var action = ( ( data.queue == 'b' ) ? 'on' : 'off' );
          var cancel_url = 'http://' + ip + '/cgi-bin/json.cgi?canceljob=' + data.jobid;
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
    .replace( /\-\-+/g, '-' )         // Replace multiple - with single -
    .replace( /^-+/, '' )             // Trim - from start of text
    .replace( /-+$/, '' );            // Trim - from end of text
}
