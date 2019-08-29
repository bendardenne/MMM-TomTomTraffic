Module.register("MMM-TomTomTraffic", {
  defaults: {
    apiToken: "",
    stops: []
  },

  requiresVersion: "2.1.0", // Required version of MagicMirror

  loaded: false,

  start: function() {
    // this.updateDom();
    // setInterval( () => this.updateDom(), 5000 );
  },

  getDom: function() {
    // We must load the leaflet js _after_ the css, so we cannot rely on getScripts.
    // Instead, on the first dom request, add a <script> tag and trigger a dom refresh
    // once leaflet.js is loaded.
    if (!this.loaded) {
      this.loaded = true;

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.onload = () => {
        console.log("leaflet.js loaded")
        this.updateDom();
      }

      script.src = "https://unpkg.com/leaflet@1.5.1/dist/leaflet.js";
      document.querySelector("head").appendChild(script);
      return document.createElement("span");
    }

    const container = document.createElement("div");
    const mapDiv = document.createElement("div");
    mapDiv.classList.add("map");

    const map = L.map(mapDiv);

    map.setView(this.config.location, this.config.zoomLevel);

    // TODO make style configurable / default to mapbox dark
    L.tileLayer('https://api.mapbox.com/styles/v1/bendardenne/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      maxZoom: 18,
      id: 'cjzx2kfzp0bpg1codwkco1tdk',
      accessToken: this.config.mapbox.apiToken
    }).addTo(map);

    const tomtomLayer = L.tileLayer('https://api.tomtom.com/traffic/map/4/tile/flow/{style}/{z}/{x}/{y}.png?key={accessToken}&thickness={thickness}', {
      maxZoom: 22,
      style: 'relative',
      thickness: this.config.tomtom.thickness,
      accessToken: this.config.tomtom.apiToken,
      opacity: 0.80
    });

    // Refresh the traffic layer every 10 minutes.
    setInterval(() => tomtomLayer.redraw(), 10 * 60 * 1000);
    tomtomLayer.addTo(map);
    container.appendChild(mapDiv);

    const attribContainer = document.createElement("div");
    const rotationContainer = document.createElement("div");
    const attribution = document.createElement("span");

    attribution.innerHTML = "© Mapbox, © OpenStreetMap";

    attribContainer.classList.add("mapbox-attribution-container");
    rotationContainer.classList.add("mapbox-rotation-container");
    attribution.classList.add("mapbox-attribution");

    attribContainer.appendChild(attribution);
    container.appendChild(attribContainer);

    // We need to wait until the div is added, then we need to invalidateSize()
    // in order for the map to behave correctly. This is brittle, but seems to do the trick.
    const observer = new MutationObserver(mutations => {
      map.invalidateSize(false);
      const ct = new CircleType(attribution);
      ct.radius(280);
      ct.dir(-1);
      observer.disconnect();

      // This must be done after the CircleType so as to no mess up its transforms.
      // The container is originally positioned at the bottom of the circle.
      // We rotate the container from the center of the main container (so that the rotation follows the border circle).
      // The center is at 50% of the attrib span along X, and -container.width/2 + 50% of the attrib span on the Y axis
      attribContainer.style.transformOrigin = "50% calc(-" + container.getBoundingClientRect().width / 2 + "px + 50%)";
      attribContainer.style.transform = "rotate(-45deg)";
    });

    observer.observe(mapDiv, {
      attributes: true,
      childList: true,
      subtree: true
    });



    // ct.forceWidth(true);

    return container;
  },

  getScripts: function() {
    return [this.file("vendor/circletype.min.js")];
  },

  getStyles: function() {
    return [
      "MMM-TomTomTraffic.css", "https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
    ];
  },
});
