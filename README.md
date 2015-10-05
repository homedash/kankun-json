# kankun-json

A CGI script that provides a simple RESTful JSON API for the Kankun Small K wifi switch.

_This project is a fork of Konstantin Dondoshanskiy's `relay.cgi` script._
_This project is a fork of @jeffrey_way `json.cgi` script._


## Features

* Get current status of switch
* Set switch to on
* Set switch to off

## Getting Setup

1. In the `/www/` directory on your Kankun switch, create a directory called `cgi-bin`, if it doesn't already exist.
2. Copy the `json.cgi` file into the new `/www/cgi-bin/` directory.
3. Be sure permissions are set appropriately on the new directory and file.

## Usage

Visit the IP address, with the path to the new file, in your web browser:

`http://10.0.0.43/cgi-bin/json.cgi`

This should show you information about the script, and what other functions are available.

e.g.
You can see how to turn the switch on / off by browsing to:

`http://10.0.0.43/cgi-bin/json.cgi?on`

## Example Output

Output from the base end-point, `http://10.0.0.43/cgi-bin/json.cgi`. _(Shown pretty-printed for legibility.)_
...
{
    "info": {
        "name": "kankun-json",
        "version": "0.0.2",
        "ipAddress": "192.168.0.10",
        "macaddr": "00:15:61:c0:ff:ee",
        "ssid": "yourssid",
        "channel": "1",
        "signal": "-67",
        "timezone": "DDUT-10",
        "uptime": "up 1:36"
    },
    "links": {
        "meta": {
            "state": "http://192.168.0.10/cgi-bin/json.cgi?get=state",
            "timing": "http://192.168.0.10/cgi-bin/json.cgi?get=timing"
        },
        "actions": {
            "on": "http://192.168.0.10/cgi-bin/json.cgi?set=on",
            "off": "http://192.168.0.10/cgi-bin/json.cgi?set=off"
        }
    }
}
...
