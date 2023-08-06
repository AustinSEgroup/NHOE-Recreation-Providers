require([
  "esri/Map",
  "esri/layers/FeatureLayer",
  "esri/layers/GeoJSONLayer",
  "esri/views/MapView",
  "esri/widgets/Legend",
  "esri/widgets/Expand",
  "esri/widgets/Home",
], (Map, FeatureLayer, GeoJSONLayer, MapView, Legend, Expand, Home) => {
  const clusterConfig = {
    type: "cluster",
    clusterRadius: "100px", // Set a constant value for the cluster radius
    popupTemplate: {
      title: "{cluster_count} providers",
      fieldInfos: [{
        fieldName: "cluster_count",
        format: {
          places: 0,
          digitSeparator: true
        }
      }]
    },
    visualVariables: [
      {
        type: "size",
        field: "cluster_count",
        stops: [
          { value: 0, size: 8 },
          { value: 10, size: 12 },
          { value: 50, size: 18 },
          { value: 100, size: 48 }
        ]
      }
    ],
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

  // background layer for geographic context
  const baseLayer = new FeatureLayer({
    portalItem: {
      id: "2b93b06dc0dc4e809d3c8db5cb96ba69"
    },
    legendEnabled: false,
    popupEnabled: false,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [23, 65, 65, .2],
        outline: {
          color: [50, 50, 50, 0.75],
          width: 0.5
        }
      }
    },
    spatialReference: {
      wkid: 102113
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

  const map = new Map({
    layers: [baseLayer, retailServiceProviders, layer]
  });

  const view = new MapView({
    container: "viewDiv",
    center: [-71.5, 43.75],
    constraints: {
      minScale: 3000000
    },
    map: map
  });

  // Function to apply the filters based on the selected checkboxes
    // Add each field you want to filter here
    function applyFilter() {
      const filters = {};
    
      // Add each field you want to filter here
      // Replace spaces and slashes with underscores in the field names
      if (document.getElementById("filterLessonsGuiding").checked) {
        filters["Lessons_Guiding"] = "x";
      }
      if (document.getElementById("filterDownhillSki").checked) {
        filters["Downhill_Ski"] = "x";
      }
      if (document.getElementById("filterNordicSkiSnowshoe").checked) {
        filters["Nordic_Ski_Snowshoe"] = "x";
      }
      if (document.getElementById("filterBiking").checked) {
        filters["Biking"] = "x";
      }
      if (document.getElementById("filterWhitewater").checked) {
        filters["Whitewater_Paddle"] = "x";
      }
      // Add filters for other fields
      if (document.getElementById("filterOHRV").checked) {
        filters["OHRV"] = "x";
      }
      if (document.getElementById("filterCampground").checked) {
        filters["Campground"] = "C";
      }
      if (document.getElementById("filterClimbingMountaineeringHiking").checked) {
        filters["Climbing_Mountaineering_Hiking"] = "x";
      }
      if (document.getElementById("filterMotorizedBoatingWaterSports").checked) {
        filters["Motorized_Boating_Water_Sports"] = "x";
      }
      if (document.getElementById("filterSnowmobile").checked) {
        filters["Snowmobile"] = "x";
      }
      if (document.getElementById("filterFishing").checked) {
        filters["Fishing"] = "x";
      }
      if (document.getElementById("filterArcheryShootingHunting").checked) {
        filters["Archery_Shooting_Hunting"] = "x";
      }
      if (document.getElementById("filterSurfing").checked) {
        filters["Surfing"] = "x";
      }
      if (document.getElementById("filterHorsebackRiding").checked) {
        filters["Horseback_Riding"] = "x";
      }
      if (document.getElementById("filterWildlifeViewing").checked) {
        filters["Wildlife_Viewing"] = "x";
      }
      if (document.getElementById("filterSleepawaySummerCamps").checked) {
        filters["Sleepaway_Summer_Camps"] = "x";
      }
      // ...
    
      // Determine if any filter is applied
      const hasFilters = Object.keys(filters).length > 0;
    
      // If filters are applied, set the definitionExpression on the GeoJSONLayer
      if (hasFilters) {
        let definitionExpression = "";
        for (const [field, value] of Object.entries(filters)) {
          if (definitionExpression !== "") {
            definitionExpression += " AND ";
          }
          definitionExpression += `${field} = '${value}'`;
        }
        layer.definitionExpression = definitionExpression;
      } else {
        // Clear the definitionExpression if no filters are applied
        layer.definitionExpression = "";
      }
    }
    const filterLessonsGuidingCheckbox = document.getElementById("filterLessonsGuiding");
    filterLessonsGuidingCheckbox.addEventListener("change", applyFilter);

    console.log({cluster_count});

    const filterfilterDownhillSkiCheckbox = document.getElementById("filterDownhillSki");
    filterfilterDownhillSkiCheckbox.addEventListener("change", applyFilter);

    const filterNordicSkiSnowshoeCheckbox = document.getElementById("filterNordicSkiSnowshoe");
    filterNordicSkiSnowshoeCheckbox.addEventListener("change", applyFilter);

    const filterBikingCheckbox = document.getElementById("filterBiking");
    filterBikingCheckbox.addEventListener("change", applyFilter);
  
    const filterWhitewaterCheckbox = document.getElementById("filterWhitewater");
    filterWhitewaterCheckbox.addEventListener("change", applyFilter);
  
    const filterOHRVCheckbox = document.getElementById("filterOHRV");
    filterOHRVCheckbox.addEventListener("change", applyFilter);
  
    const filterCampgroundCheckbox = document.getElementById("filterCampground");
    filterCampgroundCheckbox.addEventListener("change", applyFilter);
  
    const filterClimbingMountaineeringHikingCheckbox = document.getElementById("filterClimbingMountaineeringHiking");
    filterClimbingMountaineeringHikingCheckbox.addEventListener("change", applyFilter);
  
    const filterMotorizedBoatingWaterSportsCheckbox = document.getElementById("filterMotorizedBoatingWaterSports");
    filterMotorizedBoatingWaterSportsCheckbox.addEventListener("change", applyFilter);
  
    const filterSnowmobileCheckbox = document.getElementById("filterSnowmobile");
    filterSnowmobileCheckbox.addEventListener("change", applyFilter);
  
    const filterFishingCheckbox = document.getElementById("filterFishing");
    filterFishingCheckbox.addEventListener("change", applyFilter);
  
    const filterArcheryShootingHuntingCheckbox = document.getElementById("filterArcheryShootingHunting");
    filterArcheryShootingHuntingCheckbox.addEventListener("change", applyFilter);
  
    const filterSurfingCheckbox = document.getElementById("filterSurfing");
    filterSurfingCheckbox.addEventListener("change", applyFilter);
  
    const filterHorsebackRidingCheckbox = document.getElementById("filterHorsebackRiding");
    filterHorsebackRidingCheckbox.addEventListener("change", applyFilter);
  
    const filterWildlifeViewingCheckbox = document.getElementById("filterWildlifeViewing");
    filterWildlifeViewingCheckbox.addEventListener("change", applyFilter);
  
    const filterSleepawaySummerCampsCheckbox = document.getElementById("filterSleepawaySummerCamps");
    filterSleepawaySummerCampsCheckbox.addEventListener("change", applyFilter);

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

});

  