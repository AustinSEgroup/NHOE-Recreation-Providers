require([
  "esri/Map",
  "esri/layers/FeatureLayer",
  "esri/layers/GeoJSONLayer",
  "esri/layers/WebTileLayer",
  "esri/views/MapView",
  "esri/widgets/Legend",
  "esri/widgets/Expand",
  "esri/widgets/Home",
], (Map, FeatureLayer, GeoJSONLayer, WebTileLayer, MapView, Legend, Expand, Home) => {
  let selectedField;
  let isClusteringEnabled = true;

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
    url: "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/RecreationProviders_with1s/FeatureServer",
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
  const baseLayer = new WebTileLayer({
    urlTemplate: "https://api.mapbox.com/styles/v1/anovak/clkvo8z6e001j01q0b8ln9s7j/tiles/256/{level}/{col}/{row}?access_token=pk.eyJ1IjoiYW5vdmFrIiwiYSI6ImNsa2Zyd2ZvdjFjbHAzaW8zNnd4ODkwaHcifQ.V-0D14XZBY5lfMfw8Qg7vg",
    id: "custom-basemap",
    title: "Custom Basemap",
  });


  const retailServiceProviders = new FeatureLayer({
    url: "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/RetailServiceProviders/FeatureServer?",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: "rgba(168, 0, 0, 0.00)",
        outline: {
          color: "rgba(179, 255, 152, 000)",
          width: 0.25
        }
      }
    },
  });

  const newHampshire = new FeatureLayer({
    url: "https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/New_Hampshire_State_Boundary/FeatureServer",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: "rgba(168, 0, 0, 0.00)",
        outline: {
          color: "rgba(179, 255, 152, 1)",
          width: 1
        }
      }
    },
  });

  const map = new Map({
    layers: [baseLayer, newHampshire, retailServiceProviders, layer]
  });

  const view = new MapView({
    container: "viewDiv",
    center: [-71.5, 43.75],
    constraints: {
      minScale: 4000000
    },
    map: map
  });
  
  function adjustClusterVisuals(selectedField) {
    layer.queryFeatures({
        where: `${selectedField} = '1'`,
        outStatistics: [{
            onStatisticField: selectedField,
            outStatisticFieldName: "total",
            statisticType: "sum"
        }]
    }).then(function(result) {
        var total = result.features[0].attributes.total;
        var maxSize = 50;
        var sizeIncrement = maxSize / total;

        clusterConfig.visualVariables[0].stops = [
            { value: 0, size: 8 },
            { value: total * 0.25, size: 8 + sizeIncrement * 0.25 },
            { value: total * 0.5, size: 8 + sizeIncrement * 0.5 },
            { value: total * 0.5, size: 8 + sizeIncrement * 0.5 },
        ];

        layer.featureReduction = clusterConfig;
        
    });
  }
  
  layer.effect = "bloom(0.1, 0.1px, 15%)";
  newHampshire.effect = "bloom(1, 0.1px, 15%)";
  // Function to apply the filters based on the selected checkboxes
    // Add each field you want to filter here
    function applyFilter() {
      const filters = {};
    
      // Add each field you want to filter here
      // Replace spaces and slashes with underscores in the field names
      if (document.getElementById("filterLessonsGuiding").checked) {
        filters["Lessons_Guiding"] = "1";
        selectedField = "Lessons_Guiding";
        adjustClusterVisuals();
      } 
      
      if (document.getElementById("filterDownhillSki").checked) {
        filters["Downhill_Ski"] = "1";
        selectedField = "Downhill_Ski";

      } 
      
      if (document.getElementById("filterNordicSkiSnowshoe").checked) {
        filters["Nordic_Ski_Snowshoe"] = "1";
        selectedField = "Nordic_Ski_Snowshoe";
      }
      
      if (document.getElementById("filterBiking").checked) {
        filters["Biking"] = "1";
        selectedField = "Biking";
      } 
      
      if (document.getElementById("filterWhitewater").checked) {
        filters["Whitewater_Paddle"] = "1";
        selectedField = "Whitewater_Paddle";
      } 
      
      if (document.getElementById("filterOHRV").checked) {
        filters["OHRV"] = "1";
        selectedField = "OHRV";
      } 
      
      if (document.getElementById("filterCampground").checked) {
        filters["Campground"] = "1";
        selectedField = "Campground";
      } 
      
      if (document.getElementById("filterClimbingMountaineeringHiking").checked) {
        filters["Climbing_Mountaineering_Hiking"] = "1";
        selectedField = "Climbing_Mountaineering_Hiking";
      } 
      
      if (document.getElementById("filterMotorizedBoatingWaterSports").checked) {
        filters["Motorized_Boating_Water_Sports"] = "1";
        selectedField = "Motorized_Boating_Water_Sports";
        
      } 
      
      if (document.getElementById("filterSnowmobile").checked) {
        filters["Snowmobile"] = "1";
        selectedField = "Snowmobile";
      } 
      
      if (document.getElementById("filterFishing").checked) {
        filters["Snowmobile"] = "1";
        selectedField = "Fishing";
        console.log(selectedField);
      } 
      
      if (document.getElementById("filterArcheryShootingHunting").checked) {
        filters["Archery_Shooting_Hunting"] = "1";
        selectedField = "Archery_Shooting_Hunting";
      } 
      
      if (document.getElementById("filterSurfing").checked) {
        filters["Surfing"] = "1";
        selectedField = "Surfing";
      }
      
      if (document.getElementById("filterHorsebackRiding").checked) {
        filters["Horseback_Riding"] = "1";
        selectedField = "Horseback_Riding";
      } 
      
      if (document.getElementById("filterWildlifeViewing").checked) {
        filters["Wildlife_Viewing"] = "1";
        selectedField = "Wildlife_Viewing";
      } 
      
     if (document.getElementById("filterSleepawaySummerCamps").checked) {
        filters["Sleepaway_Summer_Camps"] = "1";
        selectedField = "Sleepaway_Summer_Camps";
      }
    
      // ...
    
      // Determine if any filter is applied
      const hasFilters = Object.keys(filters).length > 0;
    
      // If filters are applied, set the definitionExpression on the GeoJSONLayer
      if (Object.keys(filters).length > 0) {
        let definitionExpression = "";
        for (const [field, value] of Object.entries(filters)) {
            if (definitionExpression !== "") {
                definitionExpression += " AND ";
            }
            definitionExpression += `${field} = '${value}'`;
        }
        layer.definitionExpression = definitionExpression;
    } else {
        layer.definitionExpression = "";
    }

    adjustClusterVisuals(selectedField);
  }

    const filterLessonsGuidingCheckbox = document.getElementById("filterLessonsGuiding");
    filterLessonsGuidingCheckbox.addEventListener("change", applyFilter);

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

    document.getElementById('toggleClustering').addEventListener('click', function() {
        if (isClusteringEnabled) {
            layer.featureReduction = null;
            isClusteringEnabled = false;
            this.textContent = "Enable Clustering";
        } else {
            layer.featureReduction = clusterConfig;
            isClusteringEnabled = true;
            this.textContent = "Disable Clustering";
        }
    });
  /* 
  ************************************************************
         ****************   HEATMAP *******************
  */
  const heatmapRenderer = {
    type: "heatmap",
    colorStops: [
      { ratio: 0, color: "rgba(255, 255, 255, 0)" }, // Transparent white for lowest intensity
      { ratio: 0.2, color: "rgba(255, 255, 255, .55)" }, // Opaque white for low intensity
      { ratio: 0.4, color: "rgba(255, 200, 0, .65)" },  // Yellow color for moderate intensity
      { ratio: 0.6, color: "rgba(255, 140, 0, .75)" },  // Orange color for higher intensity
      { ratio: 0.8, color: "rgba(255, 80, 0, .85)" },   // Dark orange for even higher intensity
      { ratio: 1, color: "rgba(255, 0, 0, .95)" },      // Red for highest intensity
    ],
    minPixelIntensity: 0,
    maxPixelIntensity: 100,
    radius: 15,
};

let isHeatmapEnabled = false;

function toggleHeatmapFunction() {
  if (isHeatmapEnabled) {
      // Switch back to clustering
      layer.renderer = { // This was clusterRenderer, which isn't defined. Changing to use simple renderer
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
      };
      layer.featureReduction = clusterConfig;  // Apply clustering
      isHeatmapEnabled = false;  // Set the flag
      this.textContent = "Enable Heatmap";  // Update button text
  } else {
      // Switch to heatmap
      layer.renderer = heatmapRenderer;  // Set the heatmap renderer
      layer.featureReduction = null;  // Disable clustering
      isHeatmapEnabled = true;  // Set the flag
      this.textContent = "Disable Heatmap";  // Update button text
  }
}

document.getElementById('toggleHeatmap').addEventListener('click', toggleHeatmapFunction);
/* 
  ************************************************************
         ****************   OTHER ITEMS *******************
  */
   
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
  