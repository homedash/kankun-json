#!/bin/sh
echo "Content-Type: application/json"
echo "Cache-Control: no-cache, must-revalidate"
echo "Expires: Sat, 26 Jul 1997 05:00:00 GMT"
echo

VERSION=0.0.1
RELAY_CTRL=/sys/class/leds/tp-link:blue:relay/brightness
TIMINGS=`tail -n+3 /etc/online.txt | sed ':a;N;$!ba;s/\n/","/g'`

case "$QUERY_STRING" in
  state)
    case "`cat $RELAY_CTRL`" in
      0) echo "{\"state\":\"off\"}"
      ;;
      1) echo "{\"state\":\"on\"}"
      ;;
    esac
  ;;
  on)
    echo 1 > $RELAY_CTRL
    echo "{\"ok\":true}"
  ;;
  off)
    echo 0 > $RELAY_CTRL
    echo "{\"ok\":true}"
  ;;
  timing)
    echo "{\"timings\":[\"$TIMINGS\"]}"
  ;;
  *)
    echo "{\"info\":{\"name\":\"kankun-json\",\"version\":\"$VERSION\"},\"links\":{\"meta\":{\"state\":\"http://10.0.0.14/cgi-bin/json.cgi?state\",\"timing\":\"http://10.0.0.14/cgi-bin/json.cgi?timing\"},\"actions\":{\"on\":\"http://10.0.0.14/cgi-bin/json.cgi?on\",\"off\":\"http://10.0.0.14/cgi-bin/json.cgi?off\"}}}"
  ;;
esac
