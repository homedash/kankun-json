#!/bin/sh
echo "Content-Type: application/json"
echo "Cache-Control: no-cache, must-revalidate"
echo "Expires: Sat, 26 Jul 1997 05:00:00 GMT"
echo

RELAY_CTRL=/sys/class/leds/tp-link:blue:relay/brightness

case "$QUERY_STRING" in
  state)
    case "`cat $RELAY_CTRL`" in
      0) echo '{"state":"off"}'
      ;;
      1) echo '{"state":"on"}'
      ;;
    esac
  ;;
  on)
    echo 1 > $RELAY_CTRL
    echo '{"ok":true}'
  ;;
  off)
    echo 0 > $RELAY_CTRL
    echo '{"ok":false}'
  ;;
  *)
    echo '{"info":{"name":"kankun-json","version":"0.0.1"},"links":{"meta":{"state":"http://10.0.0.14/cgi-bin/json.cgi?state"},"actions":{"on":"http://10.0.0.14/cgi-bin/json.cgi?on","off":"http://10.0.0.14/cgi-bin/json.cgi?off"}}}'
  ;;
esac
