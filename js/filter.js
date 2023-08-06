const crimeNodes = document.querySelectorAll('.crime-item');
const crimesElement = document.getElementById('crimes-filter');

// click event handler for crime amount choices
crimesElement.addEventListener("click", filterByCrimeAmount);

// User clicked on Winter, Spring, Summer or Fall
// set an attribute filter on flood warnings layer view
// to display the warnings issued in that season
function filterByCrimeAmount(event) {
  const selectedCrimeAmount = event.target.getAttribute("data-crime");

  // switch statement for checking selectedCrimeAmount and then set filter
  // where clause

  switch (selectedCrimeAmount) {
    case "100":
      crimeLayerView.filter = {
        where: "CrimeCnt >= '" + selectedCrimeAmount + "'"
      };
      break;
    case "50-99":
      crimeLayerView.filter = {
        where: "(CrimeCnt >= 50)" + 'AND' + "(CrimeCnt <= 99)"
      };
      break;
    case "49":
      crimeLayerView.filter = {
        where: "CrimeCnt <= '" + selectedCrimeAmount + "'"
      };
  }
}

view.whenLayerView(layer).then(function (layerView) {
  // Crime data layer is loaded
  // Get a reference to the crime data layerview
  crimeLayerView = layerView;

  // Set up the UI items
  crimesElement.style.visibility = "visible";
  const crimesExpand = new Expand({
    view: view,
    content: crimesElement,
    expandIconClass: "esri-icon-filter",
    group: "top-left"
  });

  // Clear the filters when the user closes the expand widget
  crimesExpand.watch("expanded", function () {
    if (!crimesExpand.expanded) {
      crimeLayerView.filter = null;
    }
  });

  // Add the widget
  view.ui.add(crimesExpand, "top-left");
});