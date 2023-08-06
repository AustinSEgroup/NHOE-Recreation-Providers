view.whenLayerView(layer).then(function (layerView) {
    view.goTo(layerView.fullExtent.expand(1.2));
  });
  view.ui.add(new Home({
    view: view
  }), "top-left");

  const legend = new Legend({
    view: view,
    container: "legendDiv"
  });

  const infoDiv = document.getElementById("infoDiv");
  view.ui.add(new Expand({
    view: view,
    content: infoDiv,
    expandIcon: "list-bullet",
    expanded: false
  }), "top-left");



require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/GeoJSONLayer",
    "esri/widgets/Home",
    "esri/widgets/Legend",
    "esri/widgets/Expand"
  ], (Map, FeatureLayer, GeoJSONLayer, MapView, Legend, Expand, Home) => {
    const map = new Map({
        layers: [baseLayer, retailServiceProviders, layer]
      });
  
    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-71.4969661, 43.6546402],
      zoom: 10
    });
  
    const geoJSONData = {
      // Paste the entire GeoJSON data here
    };
  
    const clusterConfig = {
      type: "cluster",
      clusterRadius: "100px",
      // {cluster_count} is an aggregate field containing
      // the number of features comprised by the cluster
      popupTemplate: {
        title: "Cluster summary",
        content: "This cluster represents {cluster_count} businesses.",
        fieldInfos: [{
          fieldName: "cluster_count",
          format: {
            places: 0,
            digitSeparator: true
          }
        }]
      },
      clusterMinSize: "8px",
      clusterMaxSize: "60px",
      labelingInfo: [{
        deconflictionStrategy: "none",
        labelExpressionInfo: {
          expression: "Text($feature.cluster_count, '#,###')"
        },
        symbol: {
          type: "text",
          color: "#004a5d",
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "12px"
          }
        },
        labelPlacement: "center-center",
      }]
    };
  
    const layer = new FeatureLayer({
      url: "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/Recreation_Providers/FeatureServer",
      featureReduction: clusterConfig,
      popupTemplate: {
        title: "{Name}",
        content: "Town or City: {Town or City}<br>Website: <a href='{Website}' target='_blank'>{Website}</a>",
        fieldInfos: [
          // Add additional fieldInfos for other properties you want to display in the popup
        ]
      },
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-marker",
          size: 6,
          color: "#69dcff",
          outline: {
            color: "rgba(0, 139, 174, 0.5)",
            width: 1
          }
        }
      }
    });

    const retailServiceProviders = new FeatureLayer({
        url: "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/RetailServiceProviders/FeatureServer?",
  
        renderer: {
          type: "simple",
          symbol: {
            type: "simple-fill",
            color: [23, 65, 65, 1],
            outline: {
              color: [50, 50, 50, 0.75],
              width: 0.5
            }
          }
        },
  
      });
  

    // Function to apply the filter
    function applyFilter() {
      const filters = {};
  
      // Add each field you want to filter here
      if (document.getElementById("filterBiking").checked) {
        filters["Biking"] = "x";
      }
  
      if (document.getElementById("filterWhitewater").checked) {
        filters["Whitewater/Paddle"] = "x";
      }
  
      // Add other fields and their values as needed
  
      // Determine if any filter is applied
      const hasFilters = Object.keys(filters).length > 0;
  
      // Set the featureReduction of the geoJSONLayer based on the filters
      layer.featureReduction = hasFilters ? clusterConfig : null;
  
      // If filters are applied, set the filterFunction to show only points that match the selected value
      if (hasFilters) {
        layer.filterFunction = (graphic) => {
          for (const [field, value] of Object.entries(filters)) {
            if (graphic.attributes[field] !== value) {
              return false;
            }
          }
          return true;
        };
      } else {
        // Clear the filterFunction if no filters are applied
        layer.filterFunction = null;
      }
    }
  
    // Add event listeners to the checkboxes
    const filterBikingCheckbox = document.getElementById("filterBiking");
    const filterWhitewaterCheckbox = document.getElementById("filterWhitewater");
    // Add other checkboxes as needed
  
    filterBikingCheckbox.addEventListener("change", applyFilter);
    filterWhitewaterCheckbox.addEventListener("change", applyFilter);
    // Add other checkboxes as needed
  
    view.whenLayerView(layer).then(function (layerView) {
      view.goTo(layerView.fullExtent.expand(1.2));
    });
  
    view.ui.add(new Home({
      view: view
    }), "top-left");
  
    const legend = new Legend({
      view: view,
      container: "legendDiv"
    });
  
    const infoDiv = document.createElement("div");
    infoDiv.innerHTML = "<b>Information List:</b><br><ul><li>Recreation providers data</li><li>Other relevant information</li></ul>";
    view.ui.add(new Expand({
      view: view,
      content: infoDiv,
      expandIconClass: "esri-icon-layer-list",
      expanded: false
    }), "top-left");
  });