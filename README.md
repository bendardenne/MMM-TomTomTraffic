# MMM-TomTomTraffic

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

This module shows a map with traffic density from TomTom's traffic API.

![Example screenshot](https://raw.githubusercontent.com/bendardenne/MMM-TomTomTraffic/master/img/screenshot.png)


## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:

```javascript
var config = {
    modules: [
      {
        module: "MMM-TomTomTraffic",
        position: "bottom_left",
        config: {
          location: [50.8320000, 4.3818633],
          zoomLevel: 14,
          tomtom: {
            apiToken: "TOM TOM API TOKEN",
            thickness: 4,
          },
          mapbox: {
            apiToken: "MAP API TOKEN"
          }
        }
      }
    ]
}
```

See below for details

## Configuration options

Option            | Description
----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`location`        | _Required_ Array of Lon, Lat of the center of the map.
`zoomLevel`       | _Required_ Zoom level of the map.
`tomtom.apiToken` | _Required_ Tom Tom API Token.
