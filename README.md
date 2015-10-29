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
```json
{
    "info": {
        "name": "kankun-json",
        "version": "0.0.2",
        "ipAddress": "192.168.0.11",
        "macaddr": "00:15:61:f2:83:57",
        "ssid": "ireadyourmail",
        "channel": "11",
        "signal": "-83",
        "timezone": "EST-10EST,M10.1.0,M4.1.0/3",
        "uptime": "2:41"
    },
    "links": {
        "meta": {
            "state": "http://192.168.0.11/cgi-bin/json.cgi?get=state",
            "timing": "http://192.168.0.11/cgi-bin/json.cgi?get=timing"
        },
        "actions": {
            "on": "http://192.168.0.11/cgi-bin/json.cgi?set=on",
            "off": "http://192.168.0.11/cgi-bin/json.cgi?set=off"
        }
    }
}
```
