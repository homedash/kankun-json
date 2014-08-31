#!/bin/sh
echo "Content-Type: application/javascript"
echo "Cache-Control: no-cache, must-revalidate"
echo "Expires: Sat, 26 Jul 1997 05:00:00 GMT"
echo

VERSION=0.0.1
RELAY_CTRL=/sys/class/leds/tp-link:blue:relay/brightness
TIMINGS=`tail -n+3 /etc/online.txt | sed ':a;N;$!ba;s/\n/","/g'`
IP_ADDRESS=`ifconfig wlan0 | sed ':a;N;$!ba;s/\n/","/g' | grep -E -o '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | head -n 1`

get=$(echo "$QUERY_STRING" | sed -n 's/^.*get=\([^&]*\).*$/\1/p' | sed "s/%20/ /g")
set=$(echo "$QUERY_STRING" | sed -n 's/^.*set=\([^&]*\).*$/\1/p' | sed "s/%20/ /g")
callback=$(echo "$QUERY_STRING" | sed -n 's/^.*callback=\([^&]*\).*$/\1/p' | sed "s/%20/ /g")

case "$get" in
  state)
    case "`cat $RELAY_CTRL`" in
      0) echo "$callback({\"state\":\"off\"})"
      ;;
      1) echo "$callback({\"state\":\"on\"})"
      ;;
    esac
  ;;
  timing)
    echo "$callback({\"timings\":[\"$TIMINGS\"]})"
  ;;
esac

case "$set" in
  on)
    echo 1 > $RELAY_CTRL
    echo "$callback({\"ok\":true})"
  ;;
  off)
    echo 0 > $RELAY_CTRL
    echo "$callback({\"ok\":true})"
  ;;
esac

if [ -z "$get" ] && [ -z "$set" ]; then
  echo "$callback({\"info\":{\"name\":\"kankun-json\",\"version\":\"$VERSION\",\"ipAddress\":\"$IP_ADDRESS\"},\"links\":{\"meta\":{\"state\":\"http://$IP_ADDRESS/cgi-bin/json.cgi?get=state\",\"timing\":\"http://$IP_ADDRESS/cgi-bin/json.cgi?get=timing\"},\"actions\":{\"on\":\"http://$IP_ADDRESS/cgi-bin/json.cgi?set=on\",\"off\":\"http://$IP_ADDRESS/cgi-bin/json.cgi?set=off\"}}})"
fi
