Module.register("MMM-TomTomTraffic", {
  defaults: {
    size: 300,
    zoomLevel: 14
  },

  requiresVersion: "2.1.0", // Required version of MagicMirror

  loaded: false,

  getDom: function() {
    // We must load the leaflet js _after_ the css, so we cannot rely on getScripts.
    // Instead, on the first dom request, add a <script> tag and trigger a dom refresh
    // once leaflet.js is loaded.
    if (!this.loaded) {
      this.loaded = true;

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.onload = () => {
        console.debug("leaflet.js loaded");
        this.updateDom();
      };

      script.src = "https://unpkg.com/leaflet@1.5.1/dist/leaflet.js";
      document.querySelector("head").appendChild(script);
      return document.createElement("span");
    }

    const container = document.createElement("div");
    const mapDiv = document.createElement("div");
    mapDiv.classList.add("map");
    mapDiv.style.width = this.config.size + "px";
    mapDiv.style.height = this.config.size + "px";

    const map = L.map(mapDiv, {
      zoomControl: false
    });

    if (!this.config.location || !Array.isArray(this.config.location) ||
      this.config.location.length != 2) {
      console.error("MMM-TomTomTraffic: Provide a map location in the module configuration");
      container.innerHTML = "Provide a map location in the module configuration";
      return container;
    }

    map.setView(this.config.location, this.config.zoomLevel);

    if (this.config.mapbox.apiToken) {
      L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        maxZoom: 18,
        id: this.config.mapbox.mapId || "mapbox/dark-v10",
        accessToken: this.config.mapbox.apiToken
      }).addTo(map);
    }

    const tomtomLayer = L.tileLayer("https://api.tomtom.com/traffic/map/4/tile/flow/{style}/{z}/{x}/{y}.png?key={accessToken}&thickness={thickness}", {
      maxZoom: 22,
      style: "relative",
      thickness: this.config.tomtom.thickness || 5,
      accessToken: this.config.tomtom.apiToken,
      opacity: 0.80
    });

    // Refresh the traffic layer every 10 minutes.
    setInterval(() => tomtomLayer.redraw(), 10 * 60 * 1000);
    tomtomLayer.addTo(map);
    container.appendChild(mapDiv);

    const attribContainer = document.createElement("div");
    const attribution = document.createElement("span");
    attribution.innerHTML = "© Mapbox, © OpenStreetMap";
    attribution.classList.add("mapbox-attribution");

    attribContainer.classList.add("mapbox-attribution-container");
    attribContainer.style.left = (this.config.size / 2) + "px";

    attribContainer.appendChild(attribution);
    container.appendChild(attribContainer);

    // We need to wait until the div is added, then we need to invalidateSize()
    // in order for the map to behave correctly. This is brittle, but seems to do the trick.
    const observer = new MutationObserver(mutations => {
      map.invalidateSize(false);
      attribContainer.style.height = attribution.getBoundingClientRect().height + "px";
      const ct = new CircleType(attribution);
      ct.radius(this.config.size / 2 + 10);
      ct.dir(-1);
      observer.disconnect();

      // This must be done after the CircleType so as to no mess up its transforms.
      // The container is originally positioned at the bottom of the circle.
      // We rotate the container from the center of the main container (so that the rotation follows the border circle).
      attribContainer.style.transformOrigin = "0% calc(-" + (container.getBoundingClientRect().width / 2) + "px + 100%)";
      attribContainer.style.transform = "translateY(-100%) rotate(-45deg)";
    });

    observer.observe(mapDiv, {
      attributes: true,
      childList: true,
      subtree: true
    });

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
