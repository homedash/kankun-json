# kankun-json

A CGI script that provides a simple web interface and RESTful JSON API for the Kankun Small K wifi switch.

_This project is a fork of Konstantin Dondoshanskiy's `relay.cgi` script._

## Features

* Get current status of switch
* Set switch to on
* Set switch to off

## Getting Setup

1. Copy the contents of this repository into the `/www/` directory on your Kankun switch.
2. Be sure permissions are set appropriately on the new directories and files.

## Usage

Visit the IP address of your switch in your web browser:

`http://10.0.0.10/`

This should show you information about the switches, and allow you to control them.

e.g.
You can see how to turn the switch on / off, or set delayed on / off.

## Screenshots

![Main web interface](https://cldup.com/5D7vMF0lTd-1200x1200.png)

![Individual switch slide down](https://cldup.com/IWUIAjr2pJ-1200x1200.png)

## Example API Output

Output from the base end-point, `http://10.0.0.10/cgi-bin/json.cgi`. _(Shown pretty-printed for legibility.)_

```json
{
    "info": {
        "name": "kankun-json",
        "version": "0.0.3",
        "ipAddress": "10.0.0.10",
        "macaddr": "00:15:61:f2:83:57",
        "ssid": "ireadyourmail",
        "channel": "11",
        "signal": "-83",
        "timezone": "EST-10EST,M10.1.0,M4.1.0/3",
        "uptime": "2:41"
    },
    "links": {
        "meta": {
            "state": "http://10.0.0.10/cgi-bin/json.cgi?get=state",
            "timing": "http://10.0.0.10/cgi-bin/json.cgi?get=timing"
        },
        "actions": {
            "on": "http://10.0.0.10/cgi-bin/json.cgi?set=on",
            "off": "http://10.0.0.10/cgi-bin/json.cgi?set=off"
        }
    }
}
```

## Contributing

If you'd like to contribute to the development of kankun-json, please review the [guidelines for contributing](https://github.com/homedash/kankun-json/blob/master/CONTRIBUTING.md).
