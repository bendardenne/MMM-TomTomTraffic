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
          size: 500,
          zoomLevel: 14,
          tomtom: {
            apiToken: "TOM TOM API TOKEN",
            thickness: 4,
          },
          mapbox: {
            apiToken: "MAPBOX API TOKEN",
            mapId: "mapbox/light-v10"
          }
        }
      }
    ]
}
```

## Configuration options

Option             | Description
------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------
`location`         | _Required_ Array of Lon, Lat of the center of the map.
`size`             | _Optional_ Size (in pixels) of the component. Default: 300
`zoomLevel`        | _Optional_ Zoom level of the map. Default: 14
`tomtom.apiToken`  | _Required_ Tom Tom API token.
`tomtom.thickness` | _Optional_ Thickness factor for the traffic lines. Default: 5
`mapbox.apiToken`  | _Optional_ Mapbox API token. If not provided, no background data will be shown.
`mapbox.mapId`     | _Optional_ Mapbox map id. This is of the form "user/styleId". Mapbox provides a couple of default styles. You can also make your own style in MapBox studio. The default style is a slightly tweaked version of Decimal (without labels).

## API tokens

### TomTom

To obtain a TomTom API token, go to <https://developer.tomtom.com/> and create an account. Then create an app. Use the "Consumer API Key" in the configuration of the module.

### MapBox

This is optional. If you don't provide a MapBox API token, no background data will be loaded and only the traffic map from TomTom will be shown.
To obtain a token, go to <https://account.mapbox.com> and create an account, then create a token.
