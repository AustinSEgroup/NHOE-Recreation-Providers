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
  let clusterConfig;


function drawCluster() {
  console.log(`${selectedField}`)
   clusterConfig = {
    
    type: "cluster",

    popupTemplate: {
      title: "{cluster_count} providers",
      fieldInfos: [
        {
          fieldName: "cluster_count",
          format: {
            places: 0,
            digitSeparator: true,
          },
        },
        {
          fieldName: "cluster_size",
          format: {
            places: 0,
            digitSeparator: true,
          },
        },
      ],
    },
    fields: [{
      name: `${selectedField}`,
      alias: `${selectedField}`,
      onStatisticField: `${selectedField}`,
      statisticType: "sum"
    }],
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        style: "circle",
        color: "#83DBBB",
        size: 24,
        outline: {
          color: "#9BF1D2",
          width: 5
        }
      },
      visualVariables: [
        {
          type: "size",
          field: `${selectedField}`,
          stops: [
            { value: 1, size: 4 },
            { value: 2, size: 6 },
            { value: 4, size: 12 },
            { value: 8, size: 18 },
            { value: 16, size: 26 },
            { value: 32, size: 36 },
            { value: 64, size: 48 }
          ]
        }
      ]
    },

    clusterRadius: "120px",
    // {cluster_count} is an aggregate field containing
    // the number of features comprised by the cluster
 
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
  layer.featureReduction = clusterConfig;
}

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
  
  layer.effect = "bloom(0.1, 0.1px, 15%)";
  newHampshire.effect = "bloom(1, 0.1px, 15%)";
  

    const filterFieldsMap = {
      filterLessonsGuiding: "Lessons_Guiding",
      filterDownhillSki: "Downhill_Ski",
      filterNordicSkiSnowshoe: "Nordic_Ski_Snowshoe",
      filterBiking: "Biking",
      filterWhitewater: "Whitewater_Paddle",
      filterOHRV: "OHRV",
      filterCampground: "Campground",
      filterClimbingMountaineeringHiking: "Climbing_Mountaineering_Hiking",
      filterMotorizedBoatingWaterSports: "Motorized_Boating_Water_Sports",
      filterSnowmobile: "Snowmobile",
      filterFishing: "Fishing",
      filterArcheryShootingHunting: "Archery_Shooting_Hunting",
      filterSurfing: "Surfing",
      filterHorsebackRiding: "Horseback_Riding",
      filterWildlifeViewing: "Wildlife_Viewing",
      filterSleepawaySummerCamps: "Sleepaway_Summer_Camps"
  };
  
  function applyFilter() {
      
      const filters = {};
      
      for (let [id, field] of Object.entries(filterFieldsMap)) {
          if (document.getElementById(id).checked) {
            selectedField = field;
              filters[field] = "1";
              
              
          }

          
      }
     

      let definitionExpression = Object.keys(filters).map(field => `${field} = '1'`).join(" AND ");
      layer.definitionExpression = definitionExpression;
          // Redraw the cluster based on the new selected field
          if (Object.keys(filters).length > 0) {
            drawCluster(); // Redraw the cluster based on the new selected field
            layer.featureReduction = clusterConfig; // Update the layer's featureReduction with the updated clusterConfig
        } else {
            layer.featureReduction = null; // No filter selected, turn off clustering
        }
    }
  
  
  for (let id of Object.keys(filterFieldsMap)) {
      document.getElementById(id).addEventListener("change", applyFilter);
  }
  
  /* =
  ************************************************************
         ****************   HEATMAP *******************
  */
  const heatmapRenderer = {
    type: "heatmap",
    colorStops: [
      { ratio: 0, color: "rgba(202, 255, 200, 0)" }, // Transparent white for lowest intensity
      { ratio: 0.2, color: "rgba(198, 245, 165, .75)" }, // Opaque white for low intensity
      { ratio: 0.4, color: "rgba(216, 255, 113, .80)" },  // Yellow color for moderate intensity
      { ratio: 0.6, color: "rgba(244, 254, 90 , .90)" },  // Orange color for higher intensity
      { ratio: 0.8, color: "rgba(255, 207, 55 , .95)" },   // Dark orange for even higher intensity
      { ratio: 1, color: "rgba(255, 140, 55 , 100)" },      // Red for highest intensity
    ],
    minPixelIntensity: 25,
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
  