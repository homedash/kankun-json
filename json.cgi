#!/bin/sh
VERSION=0.0.1
RELAY_CTRL=/sys/class/leds/tp-link:blue:relay/brightness
TIMINGS=`tail -n+3 /etc/online.txt | sed ':a;N;$!ba;s/\n/","/g'`
IP_ADDRESS=`ifconfig wlan0 | sed ':a;N;$!ba;s/\n/","/g' | grep -E -o '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | head -n 1`
TZ=`cat /etc/TZ`
WIFI_SSID=`iw dev wlan0 link | grep SSID | awk '{ print $2 }'`
WIFI_SIGNAL=`iw dev wlan0 link | grep signal | awk '{ print $2 }'`
WIFI_CHANNEL=`iw dev wlan0 info | grep channel | awk '{ print $2 }'`
WIFI_MACADDR=`iw dev wlan0 info  | grep addr | awk '{ print $2 }'`
LWRAPPER=""
RWRAPPER=""

get=$(echo "$QUERY_STRING" | sed -n 's/^.*get=\([^&]*\).*$/\1/p' | sed "s/%20/ /g")
set=$(echo "$QUERY_STRING" | sed -n 's/^.*set=\([^&]*\).*$/\1/p' | sed "s/%20/ /g")
callback=$(echo "$QUERY_STRING" | sed -n 's/^.*callback=\([^&]*\).*$/\1/p' | sed "s/%20/ /g")

if [ ! -z $callback ]; then
  LWRAPPER="("
  RWRAPPER=")"
fi

if [ ! -z $callback ]; then
  echo "Content-Type: application/javascript"
else
  echo "Content-Type: application/json"
fi
echo "Cache-Control: no-cache, must-revalidate"
echo "Expires: Sat, 26 Jul 1997 05:00:00 GMT"
echo

case "$get" in
  state)
    case "`cat $RELAY_CTRL`" in
      0) echo "$callback$LWRAPPER{\"state\":\"off\"}$RWRAPPER"
      ;;
      1) echo "$callback$LWRAPPER{\"state\":\"on\"}$RWRAPPER"
      ;;
    esac
  ;;
  timing)
    echo "$callback$LWRAPPER{\"timings\":[\"$TIMINGS\"]}$RWRAPPER"
  ;;
esac

case "$set" in
  on)
    echo 1 > $RELAY_CTRL
    echo "$callback$LWRAPPER{\"ok\":true}$RWRAPPER"
  ;;
  off)
    echo 0 > $RELAY_CTRL
    echo "$callback$LWRAPPER{\"ok\":true}$RWRAPPER"
  ;;
esac

if [ -z "$get" ] && [ -z "$set" ]; then
  echo "$callback$LWRAPPER{\"info\":{\"name\":\"kankun-json\",\"version\":\"$VERSION\",\"ipAddress\":\"$IP_ADDRESS\",\"wifi_macaddr\":\"$WIFI_MACADDR\",\"wifi_ssid\":\"$WIFI_SSID\",\"wifi_channel\":\"$WIFI_CHANNEL\",\"wifi_signal\":\"$WIFI_SIGNAL\",\"timezone\":\"$TZ\"},\"links\":{\"meta\":{\"state\":\"http://$IP_ADDRESS/cgi-bin/json.cgi?get=state\",\"timing\":\"http://$IP_ADDRESS/cgi-bin/json.cgi?get=timing\"},\"actions\":{\"on\":\"http://$IP_ADDRESS/cgi-bin/json.cgi?set=on\",\"off\":\"http://$IP_ADDRESS/cgi-bin/json.cgi?set=off\"}}}$RWRAPPER"
fi


