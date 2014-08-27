# kankun-json

A CGI script that provides a simple RESTful JSON API for the Kankun Small K wifi switch.

## Features

* Get current status of switch
* Set switch to on
* Set switch to off
* View timings set on the switch via the mobile app

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

```
{
  "info":{
    "name":"kankun-json",
    "version":"0.0.1",
    "ipAddress":"10.0.0.43"
  },
  "links":{
    "meta":{
      "state":"http://10.0.0.43/cgi-bin/json.cgi?state",
      "timing":"http://10.0.0.43/cgi-bin/json.cgi?timing"
    },
    "actions":{
      "on":"http://10.0.0.43/cgi-bin/json.cgi?on",
      "off":"http://10.0.0.43/cgi-bin/json.cgi?off"
    }
  }
}
```
