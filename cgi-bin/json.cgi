#!/bin/sh
echo $QUERY_STRING > /tmp/query_string
VERSION=0.0.3
RELAY_CTRL=/sys/class/leds/tp-link:blue:relay/brightness
IP_ADDRESS=`ifconfig wlan0 | sed ':a;N;$!ba;s/\n/","/g' | grep -E -o '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | head -n 1`
TZ=`cat /etc/TZ`
SSID=`iw dev wlan0 link | grep SSID | awk '{ print $2 }'`
WIFI_SIGNAL=`iw dev wlan0 link | grep signal | awk '{ print $2 }'`
WIFI_CHANNEL=`iw dev wlan0 info | grep channel | awk '{ print $2 }'`
MACADDR=`iw dev wlan0 info  | grep addr | awk '{ print $2 }'`
UPTIME=`uptime | awk -F , '{ print $1 }'`
LWRAPPER=""
RWRAPPER=""
CURRENT_STATE=`cat $RELAY_CTRL`

get=$(echo "$QUERY_STRING" | sed -n 's/^.*get=\([^&]*\).*$/\1/p' | sed "s/%20/ /g")
set=$(echo "$QUERY_STRING" | sed -n 's/^.*set=\([^&]*\).*$/\1/p' | sed "s/%20/ /g")
mins=$(echo "$QUERY_STRING" | sed -n 's/^.*mins=\([^&]*\).*$/\1/p' | sed "s/%20/ /g")
canceljob=$(echo "$QUERY_STRING" | sed -n 's/^.*canceljob=\([^&]*\).*$/\1/p' | sed "s/%20/ /g")

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
    case "$CURRENT_STATE" in
      0) echo "$callback$LWRAPPER{\"state\":\"off\"}$RWRAPPER"
      ;;
      1) echo "$callback$LWRAPPER{\"state\":\"on\"}$RWRAPPER"
      ;;
    esac
  ;;
  jobs)  # list all the scheduled jobs
      i=0
      echo "$callback$LWRAPPER{\"jobs\":["
      atq | while read line; do
        job_id=$(echo $line | awk '{ print $1 }')
        job_date=$(echo $line | awk '{ print $5, $2, $3, $4, $6 }')
        job_queue=$(echo $line | awk '{ print $7 }')
        joblist="{\"jobid\":$job_id,\"queue\":\"$job_queue\",\"date\":\"$job_date\"}"
        if [ $i -ne 0 ]; then
          echo ",";
        fi
        i=1
        echo "$joblist"
      done
      echo "]}$RWRAPPER"
  ;;
esac

case "$set" in
  on)
    if [ ! -z $mins ]; then
      echo "echo 1 > $RELAY_CTRL" | at now + $mins minute -M -q b
    else
      echo 1 > $RELAY_CTRL
    fi
    echo "$callback$LWRAPPER{\"ok\":true}$RWRAPPER"
  ;;
  off)
    if [ ! -z $mins ]; then
      echo "echo 0 > $RELAY_CTRL" | at now + $mins minute -M -q c
    else
      echo 0 > $RELAY_CTRL
    fi
    echo "$callback$LWRAPPER{\"ok\":true}$RWRAPPER"
  ;;
  toggle)
    case "$CURRENT_STATE" in
      0)
        if [ ! -z $mins ]; then
          echo "echo 1 > $RELAY_CTRL" | at now + $mins minute -M -q d
        else
          echo 1 > $RELAY_CTRL
        fi
      ;;
      1)
        if [ ! -z $mins ]; then
          echo "echo 0 > $RELAY_CTRL" | at now + $mins minute -M -q d
        else
          echo 0 > $RELAY_CTRL
        fi
      ;;
    esac
    echo "$callback$LWRAPPER{\"ok\":true}$RWRAPPER"
  ;;
esac


if [ "$canceljob" -ge 0 ] 2> /dev/null; then
  atrm "$canceljob"
  echo "$callback$LWRAPPER{\"ok\":true}$RWRAPPER"
fi

if [ -z "$get" ] && [ -z "$set" ]; then
  echo "$callback$LWRAPPER{\"info\":{\"name\":\"kankun-json\",\"version\":\"$VERSION\",\"ipAddress\":\"$IP_ADDRESS\",\"macaddr\":\"$MACADDR\",\"ssid\":\"$SSID\",\"channel\":\"$WIFI_CHANNEL\",\"signal\":\"$WIFI_SIGNAL\",\"timezone\":\"$TZ\",\"uptime\":\"$UPTIME\"},\"links\":{\"meta\":{\"state\":\"http://$IP_ADDRESS/cgi-bin/json.cgi?get=state\"},\"actions\":{\"on\":\"http://$IP_ADDRESS/cgi-bin/json.cgi?set=on\",\"ondelay\":\"http://$IP_ADDRESS/cgi-bin/json.cgi?set=on&mins=60\",\"off\":\"http://$IP_ADDRESS/cgi-bin/json.cgi?set=off\",\"offdelay\":\"http://$IP_ADDRESS/cgi-bin/json.cgi?set=off&mins=60\"}}}$RWRAPPER"
fi
