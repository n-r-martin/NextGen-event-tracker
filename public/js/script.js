///// GLOBAL VARIABLES /////
let eventCount = 60;
let searchText = document.getElementById("search-city");
let dataRefreshBtn = $("#data-refresh-btn");
const dateFrom = document.getElementById("from");
const dateTo = document.getElementById("to");
const errorHandle = document.getElementById("error-message");

//map variables
let layerGroup;
let map;
let minLong;
let maxLong;
let minLat;
let maxLat;
let bounds;
let storedLat;
let storedLon;

//Date Variables
let dateStart = new Date();
let dateEnd = new Date();

//Checkbox Variables
checkboxAll = $("#checkbox-all");
singleEventTypeCheckbox = $(".single-event-type");

// Extending Leaflet's default icon so we can use custom icons
var customIcon = L.Icon.extend({
  options: {
    iconSize: [30, 42],
    shadowSize: [46, 30],
    iconAnchor: [18, 42],
    shadowAnchor: [14, 32],
    popupAnchor: [-2, -44],
  },
});

const iconShadow = "img/icons/icon-shadow.svg";

const droughtIcon = new customIcon({
  iconUrl: "img/icons/drought-icon.svg",
  shadowUrl: iconShadow,
});

const dustIcon = new customIcon({
  iconUrl: "img/icons/dust-haze-icon.svg",
  shadowUrl: iconShadow,
});

const earthquakeIcon = new customIcon({
  iconUrl: "img/icons/earthquake-icon.svg",
  shadowUrl: iconShadow,
});

const floodIcon = new customIcon({
  iconUrl: "img/icons/flood-icon.svg",
  shadowUrl: iconShadow,
});

const landslideIcon = new customIcon({
  iconUrl: "img/icons/landslide-icon.svg",
  shadowUrl: iconShadow,
});

const manmadeDisasterIcon = new customIcon({
  iconUrl: "img/icons/manmade-disaster-icon.svg",
  shadowUrl: iconShadow,
});

const seaLakeIceIcon = new customIcon({
  iconUrl: "img/icons/sea-lake-ice-icon.svg",
  shadowUrl: iconShadow,
});

const stormIcon = new customIcon({
  iconUrl: "img/icons/severe-storm-icon.svg",
  shadowUrl: iconShadow,
});

const snowIcon = new customIcon({
  iconUrl: "img/icons/snow-icon.svg",
  shadowUrl: iconShadow,
});

const tempExtremeIcon = new customIcon({
  iconUrl: "img/icons/temp-extreme-icon.svg",
  shadowUrl: iconShadow,
});

const volcanoIcon = new customIcon({
  iconUrl: "img/icons/volcano-icon.svg",
  shadowUrl: iconShadow,
});

const waterColorIcon = new customIcon({
  iconUrl: "img/icons/water-color-icon.svg",
  shadowUrl: iconShadow,
});

const wildfireIcon = new customIcon({
  iconUrl: "img/icons/wildfire-icon.svg",
  shadowUrl: iconShadow,
});

const genericEventIcon = new customIcon({
   iconUrl: "img/icons/generic-event-icon.svg",
   shadowUrl: iconShadow,
 });

///// FUNCTIONS /////

// This function gets the boundaries of the current map view
function getNewBoundaries() {
  // Storing the map boundaries in a variable
  bounds = map.getBounds();

  // setting the Lat/Long variables with the current boundaries of the four sides of the map
  minLong = bounds.getWest();
  maxLong = bounds.getEast();
  minLat = bounds.getSouth();
  maxLat = bounds.getNorth();
}

// Checkbox UI Management

// Event Handlers
checkboxAll.on("change", function () {
  if (!$(this).is(":checked")) {
    singleEventTypeCheckbox.each(function () {
      if ($(this).prop("checked", true)) {
        $(this).prop("checked", false);
      }
    });
  } else {
    singleEventTypeCheckbox.each(function () {
      $(this).prop("checked", true);
    });
  }
  dataRefreshBtn.attr("disabled", false);
});

singleEventTypeCheckbox.on("change", function () {
  if (
    $(".single-event-type:checked").length == singleEventTypeCheckbox.length
  ) {
    checkboxAll.prop("checked", true);
  }

  if (!$(this).is(":checked")) {
    checkboxAll.prop("checked", false);
  }

  dataRefreshBtn.attr("disabled", false);
});

// This function fetches event data from the EONET API and uses it to populate the event markers on the map
async function dataPull() {
  //set date variables based on datepicker values
  dateStart = dateFrom.value;
  dateEnd = dateTo.value;

  // Looking at the checkboxes and if all or one is checked, push that event type to eventTypesArr which then is passed to the API call
  let eventTypesArr = [];
  if (checkboxAll.is(":checked")) {
    eventTypesArr = [];
  } else {
    singleEventTypeCheckbox.each(function () {
      if ($(this).is(":checked")) {
        eventTypesArr.push($(this).attr("data-event-type"));
      }
    });
  }

  if (dateEnd >= dateStart) {
    //--original code: let queryEONET = `https://eonet.sci.gsfc.nasa.gov/api/v3/events?bbox=${minLong},${maxLat},${maxLong},${minLat}&start=${dateStart}&end=${dateEnd}&category=${eventTypesArr}&limit=${eventCount}&status=all`;
    const queryEONET = `/api/events/eonet`;
    const queryUSGS = `/api/events/usgs`;
    const queryUserDefined = `/api/events/userPull`;
    let eventsCount = 0;
    let objAry = {};
    // console.log(`objAry is: ${JSON.stringify(objAry)}`);
    objAry = {
      minLong: `${minLong}`,
      maxLat: `${maxLat}`,
      maxLong: `${maxLong}`,
      minLat: `${minLat}`,
      dateStart: `${dateStart}`,
      dateEnd: `${dateEnd}`,
      eventTypesArr: `${eventTypesArr}`,
      eventCount: `${eventCount}`,
    };
    console.log(`objAry is: ${JSON.stringify(objAry)}`);
    console.log(`
         minLong:${minLong}, 
         maxLat:${maxLat}, 
         maxLong:${maxLong}, 
         minLat:${minLat}, 
         dateStart:${dateStart}, 
         dateEnd:${dateEnd}, 
         eventTypesArr:${eventTypesArr}, 
         eventCount:${eventCount}`);
    console.log(`queryEONET is: ${queryEONET}`);
    //--original code: fetch(queryEONET)
    // if ((eventTypesArr.length === 0) || (eventTypesArr.includes('earthquakes') && eventTypesArr.length !== 1)){
    if (!(eventTypesArr.includes("earthquakes") && eventTypesArr.length === 1)) {
      displayMessage(`PROCESSING EONET EVENT DATA...`);
      await fetch(queryEONET, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objAry),
      })
        .then(async (res) => await res.json())
        .then(async (eonetData) => {
          console.log(`eonetData is: ${eonetData}`);
          var pointList = [];
          var polygonPoints = [];
          let eventData = eonetData;
          console.log(eventData);
          if (eventData.length > 0) {
            for (let index = 0; index < eventData.length; index++) {
              if (eonetData[index].geometry[0].type !== "Polygon") {
                if (eonetData[index].geometry.length > 2) {
                  //build polyline points array
                  for (let i = 0; i < eonetData[index].geometry.length; i++) {
                    pointList.push(
                      new L.LatLng(
                        eonetData[index].geometry[i].coordinates[1],
                        eonetData[index].geometry[i].coordinates[0]
                      )
                    );
                  }
                  //add polyline to map
                  var drawPolyline = new L.polyline(pointList, {
                    color: "red",
                    weight: 2,
                    opacity: 0.25,
                    smoothFactor: 1,
                  });
                  drawPolyline.addTo(layerGroup);
                  pointList = [];
                }
                var date = new Date(eonetData[index].geometry[0].date);
                // Switch statement for icon image path - define variable and pass to marker creation
                let markerIcon;
                switch (eonetData[index].categories[0].id) {
                  case "drought":
                    markerIcon = droughtIcon;
                    break;
                  case "dustHaze":
                    markerIcon = dustIcon;
                    break;
                  case "floods":
                    markerIcon = floodIcon;
                    break;
                  case "landslides":
                    markerIcon = landslideIcon;
                    break;
                  case "manmade":
                    markerIcon = manmadeDisasterIcon;
                    break;
                  case "seaLakeIce":
                    markerIcon = seaLakeIceIcon;
                    break;
                  case "severeStorms":
                    markerIcon = stormIcon;
                    break;
                  case "snow":
                    markerIcon = snowIcon;
                    break;
                  case "tempExtremes":
                    markerIcon = tempExtremeIcon;
                    break;
                  case "volcanoes":
                    markerIcon = volcanoIcon;
                    break;
                  case "waterColor":
                    markerIcon = waterColorIcon;
                    break;
                  case "wildfires":
                    markerIcon = wildfireIcon;  
                    break;
                  default:
                    markerIcon = genericEventIcon;
                    break;
                }

                var eventMarker = L.marker(
                  [
                    eonetData[index].geometry[0].coordinates[1],
                    eonetData[index].geometry[0].coordinates[0],
                  ],
                  { icon: markerIcon }
                );
                eventMarker
                  .addTo(layerGroup)
                  //marker description with date
                  .bindPopup(
                    `${eonetData[index].title} -\n ${date.toString()}`
                  );
              } else {
                for (
                  let i = 0;
                  i < eonetData[index].geometry[0].coordinates[0].length;
                  i++
                ) {
                  polygonPoints.push([
                    eonetData[index].geometry[0].coordinates[0][i][1],
                    eonetData[index].geometry[0].coordinates[0][i][0],
                  ]);
                }
                var polygon = new L.polygon(polygonPoints, {
                  color: "orange",
                  opacity: 0.25,
                });
                polygon.addTo(layerGroup);
                polygonPoints = [];
              }
            }
            eventsCount += eventData.length;
            displayMessage(
              `${eventsCount} matching event(s) found between ${dateStart} and ${dateEnd}`
            );
            return;
          } else {
            displayMessage(
              `No matching events found in this area between ${dateStart} and ${dateEnd}`
            );
            return;
          }
        });
    }
    if (eventTypesArr.includes("earthquakes") || eventTypesArr.length === 0) {
      //-------------START USGS EARTHQUAKE-------------//
      displayMessage(`PROCESSING EARTHQUAKE DATA...`);
      await fetch(queryUSGS, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objAry),
      })
        .then(async (res) => await res.json())
        .then(async (usgsData) => {
          console.log(`usgsData is: ${usgsData}`);
          let eventData = usgsData;
          console.log(eventData);
          if (eventData.length > 0) {
            for (let index = 0; index < eventData.length; index++) {
              if (usgsData[index].geometry.type !== "Polygon") {
                let date = new Date(usgsData[index].properties.time);
                var eventMarker = L.marker(
                  [
                    usgsData[index].geometry.coordinates[1],
                    usgsData[index].geometry.coordinates[0],
                  ],
                  { icon: earthquakeIcon }
                );
                //* Credit: earthquake radius calculation - https://www.cqsrg.org/tools/perceptionradius/
                //* Calculates the preception radius Rp in km of at an earthquake of magnitude y using the Kevin McCue formula y ~ 1.01 ln(Rp) + 0.13.
                let radius = Math.floor(
                  Math.exp(usgsData[index].properties.mag / 1.01 - 0.13) *
                    1000 +
                    0.5
                );
                // console.log(`Radius is: ${radius}`);
                let eventRadius = L.circle(
                  [
                    usgsData[index].geometry.coordinates[1],
                    usgsData[index].geometry.coordinates[0],
                  ],
                  {
                    color: "orange",
                    opacity: 0.1,
                  }
                );
                let eventLink = `<a href="${usgsData[index].properties.url}"target="_blank">More Info</a>`;
                eventRadius.addTo(layerGroup).setRadius(radius);
                eventMarker
                  .addTo(layerGroup)
                  //marker description with date
                  .bindPopup(
                    `Earthquake - ${
                      usgsData[index].properties.title
                    } -\n Date/Time: ${date.toUTCString()} -\n ${eventLink}`
                  );
              };
            };
            eventsCount += eventData.length;
            displayMessage(
              `${eventsCount} matching event(s) found between ${dateStart} and ${dateEnd}`
            );
            return;
          } else {
            displayMessage(
              `${eventsCount} matching event(s) found between ${dateStart} and ${dateEnd}`
            );
            return;
          }
        });
      //-------------END USGS EARTHQUAKE-------------//
      // return;
    } else {
      displayMessage(
        `${eventsCount} matching event(s) found between ${dateStart} and ${dateEnd}`
      );
      // return;
    };
    if (eventTypesArr.length === 0) { //TODO: ADD logic here with checkbox
      //-------------START USER DEFINED DATA-------------//
      displayMessage(`PROCESSING USER DEFINED DATA...`);
      await fetch(queryUserDefined)
        .then(async (res) => await res.json())
        .then(async (userDefinedData) => {
          console.log(`userDefinedData is: ${userDefinedData}`);
          let eventData = userDefinedData;
          console.log(eventData);
          if (eventData.length > 0) {
            let checkBounds = new L.LatLngBounds(
              new L.LatLng(maxLat, maxLong),
              new L.LatLng(minLat, minLong));
            for (let index = 0; index < eventData.length; index++) {
              console.log(`point ${index} is in bounds: ${checkBounds.contains(new L.LatLng(userDefinedData[index].geometry.coordinates[1], userDefinedData[index].geometry.coordinates[0]))}`);
              let inBounds = checkBounds.contains(new L.LatLng(userDefinedData[index].geometry.coordinates[1], userDefinedData[index].geometry.coordinates[0]));
              if (inBounds){
                if (userDefinedData[index].geometry.type !== "Polygon") {
                  let date = new Date(userDefinedData[index].geometry.date);
                  var eventMarker = L.marker(
                    [
                      userDefinedData[index].geometry.coordinates[1],
                      userDefinedData[index].geometry.coordinates[0],
                    ],
                    { icon: genericEventIcon }
                  );
                  let eventLink = `<a href="${userDefinedData[index].link}"target="_blank">More Info</a>`;
                  eventMarker
                    .addTo(layerGroup)
                    //marker description with date
                    .bindPopup(
                      `USR - ${
                        userDefinedData[index].title
                      } -\n ${date.toUTCString()} -\n ${eventLink}`
                    );
                } 
              };
            };
            eventsCount += eventData.length;
            displayMessage(
              `${eventsCount} matching event(s) found between ${dateStart} and ${dateEnd}`
            );
            return;
          } else {
            displayMessage(
              `${eventsCount} matching event(s) found between ${dateStart} and ${dateEnd}`
            );
            return;
          }
        });
      } else {
        displayMessage(
          `${eventsCount} matching event(s) found between ${dateStart} and ${dateEnd}`
        );
        // return;
      }; 
        //-------------END USER DEFINED DATA-------------//
    // return;
  };
  return;
};

// Getting the city coordinates based on user entry in the city search bar
async function getCityCoord(event) {
  event.preventDefault();

  // get city name
  // let newCity = searchText.value;
  //-----NEW CODE-----//
  const cityTextInput = document.querySelector("#search-city").value.trim();

  if (cityTextInput) {
    const response = await fetch(`/api/getaddress/${cityTextInput}`, {
      method: "GET",
      //   body: JSON.stringify({ commentContent, postID }),
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
    }).then(async (response) => {
      if (response.ok) {
        await response.json().then(function (data) {
          if (data.message === "ok") {
            console.log(data);
            console.log(data.message);
            console.log(data.lat);
            console.log(data.lon);
            const lat = data.lat;
            const lon = data.lon;
            L.marker([lat, lon])
              .addTo(layerGroup)
              .bindPopup(`${cityTextInput}`); // add marker
            map.setView([lat, lon], 10); //set map to location, zoom to 10
            localStorage.setItem("Lat", lat);
            localStorage.setItem("Lon", lon);
            dataPull();
            return;
          } else {
            alert("Not a valid city");
          }
        });
      } else {
        alert("Failed to retrieve city");
      }
    });
  }
  //^^^^^END of NEW CODE^^^^^//
  // if (newCity) {

  //    // const myApiKey = "";

  //    // const weatherUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${newCity}&limit=1&appid=${myApiKey}`;

  //    fetch(weatherUrl)
  //       .then(function (response) {
  //          if (response.ok) {
  //             response.json().then(function (data) {
  //                console.log(data);
  //                // checks if the city found
  //                if (data.length > 0) {
  //                   errorHandle.style.backgroundColor = "hsla(0, 0%, 20%, .7)";
  //                   const checkCity = data[0].name;
  //                   displayMessage(`Showing area for ${checkCity}`)
  //                   // checks found city === entered city
  //                   if (checkCity.toLowerCase() == newCity.toLowerCase()) {
  //                      const lat = data[0].lat;
  //                      const lon = data[0].lon;
  //                      L.marker([data[0].lat, data[0].lon])
  //                         .addTo(layerGroup)
  //                         .bindPopup(`${checkCity} - ${newCity}`); // add marker
  //                      map.setView([lat, lon], 10) //set map to location, zoom to 10
  //                      localStorage.setItem("Lat", lat);
  //                      localStorage.setItem("Lon", lon);
  //                      dataPull();
  //                   }
  //                } else {
  //                   displayMessage("That is not a city, dummy")
  //                   errorHandle.style.backgroundColor = "red";
  //                }
  //             });
  //          }
  //       });
  // }
}

// Data Refresh Function
function dataRefresh() {
  //clear all existing point
  layerGroup.clearLayers();

  // Pull new data
  dataPull();
}

// Function for toggling visibility of the options menu
function menuToggleHide() {
  var optionsMenu = $("#option-menu");
  var userUiContainer = $("#user-ui-container");
  var velocity = 200;

  if (optionsMenu.css("display") === "none") {
    optionsMenu.toggle(
      "slide",
      { direction: "right", easing: "linear" },
      velocity
    );
    userUiContainer.animate(
      { right: "308px" },
      { duration: velocity, easing: "linear" }
    );
  } else {
    optionsMenu.toggle(
      "slide",
      { direction: "right", easing: "linear" },
      velocity
    );
    userUiContainer.animate(
      { right: "64px" },
      { duration: velocity, easing: "linear" }
    );
  }
}

function toggleUserMenu() {
   const userMenuContainer = $("#dynamic-form-container");

   if (userMenuContainer.css("display") === "none") {
      userMenuContainer.fadeIn(100);
      $(".login-form").show();
      $(".signup-form").hide();
   } else {
      userMenuContainer.fadeOut(100);
   }
}

// Function to open the modals
function openModal(evt) {
  $(".modal").removeClass("hidden");
  $("header, #map, main.overlay").addClass("blur");

  let selectedModal = evt.target.getAttribute("data-modal");

  $(".modal-header h2").text(selectedModal);
}

// Function to close the currently opened modal
function closeModal() {
  $(".modal").addClass("hidden");
  $("header, #map, main.overlay").removeClass("blur");
}

//function to get lat/lon from local storage
function getStoredLocation() {
  storedLat = localStorage.getItem("Lat");
  storedLon = localStorage.getItem("Lon");

  if (localStorage.getItem("Lat") === null) {
    localStorage.setItem("Lat", 39.85);
  }
  if (localStorage.getItem("Lon") === null) {
    localStorage.setItem("Lon", -104.67);
  }
}

///// Creating the map /////
function createMap() {
  map = L.map("map", {
    tap: false,
    center: new L.latLng(storedLat, storedLon),
    dragging: true,
    gestureHandling: "cooperative",
    zoom: 12,
  });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  layerGroup = L.layerGroup().addTo(map);
  bounds = map.getBounds();

  minLong = bounds.getWest();
  maxLong = bounds.getEast();
  minLat = bounds.getSouth();
  maxLat = bounds.getNorth();
}

//initial pull of data points from EONET
function init() {
  getStoredLocation();
  createMap();
  dataPull();
}

// setting default date range to 30 days and future date would not be allowed
function setDatePicker() {
  //get today's date
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;
  //get today's date minus 30 days
  let todayMinus = new Date();
  todayMinus.setDate(todayMinus.getDate() - 90); // today minus 30 days
  dd = String(todayMinus.getDate()).padStart(2, "0");
  mm = String(todayMinus.getMonth() + 1).padStart(2, "0");
  yyyy = todayMinus.getFullYear();
  todayMinus = yyyy + "-" + mm + "-" + dd;
  // set default date
  dateStart = todayMinus;
  dateEnd = today;
  dateFrom.value = todayMinus;
  dateTo.value = today;
  // future date restriction
  dateFrom.setAttribute("max", today);
  dateTo.setAttribute("max", today);
}

function displayMessage(string) {
  errorHandle.classList.remove("hide");
  errorHandle.textContent = string;
}

//running init functions now so event handlers can recognize them
//getStoredLocation and setDatePicker are running in and out of init, because we couldn't get them to run synchronously, and we need the variables set in them to be used in createMap and dataPull

getStoredLocation();
setDatePicker();
init();

////// EVENT HANDLERS //////

// Map move event -- triggers new boundaries
map.on("moveend", function () {
  dataRefreshBtn.attr("disabled", false);
  getNewBoundaries();
});

//Open Modals
$("#help-btn").on("click", function () {
  $("#help-modal").removeClass("hidden");
  $("header, #map, main.overlay").addClass("blur");
});

$("#about-btn").on("click", function () {
  $("#about-modal").removeClass("hidden");
  $("header, #map, main.overlay").addClass("blur");
});

// Toggle user menu on/off
$("#login-btn").on("click", function () {
  toggleUserMenu();
});

$("#dynamic-form-container").find(".fa-times").on("click", function () {
   toggleUserMenu();
});

// Toggle Login/Signup UI within user menu IF the user is logged out
$("#sign-up-form-link").on("click", function () {
   $(".login-form").toggle()
   $(".signup-form").toggle()
})

$("#login-form-link").on("click", function () {
   $(".signup-form").toggle()
   $(".login-form").toggle()
})

// Close Modal
$(".modal-close-btn").on("click", closeModal);
$(".modal-background").on("click", closeModal);

// Prevents clicking through the modal container and onto to back to close it
$(".modal-container").on("click", function (evt) {
  evt.stopPropagation();
});

// Search City Event
$("#search-bar").on("submit", function (event) {
  getCityCoord(event);
  $("#search-city").val("");
});

// Refresh Data Event
dataRefreshBtn.on("click", function () {
  dataRefreshBtn.attr("disabled", true);
  dataRefresh();
  let mapCenter = [(minLat + maxLat) / 2, (minLong + maxLong) / 2];
  localStorage.setItem("Lat", mapCenter[0]);
  localStorage.setItem("Lon", mapCenter[1]);
});

//Open Options Menu
$("#menu-open-btn").on("click", menuToggleHide);

//Close Options Menu
$("#menu-close-btn").on("click", menuToggleHide);

//Set toDate after fromDate chosen
$("#to").on("click", function (event) {
  const minDate = dateFrom.value;
  dateTo.setAttribute("min", minDate);
});



// //get lat lon on click
// map.on('click', function(e) {
//   alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
// });
let lat;
let lon;
//form to add new event
async function newFormHandler(event) {
  event.preventDefault();
  const eventName = document.querySelector('#event-name').value.trim();
  const description = document.querySelector('#description').value.trim();
  const eventType = document.querySelector('#event-type').value;
  const eventDate = document.querySelector('#event-date').value;
  let eventLat = lat;
  let eventLon = lon;
  let eventId = Math.floor(Math.random() * 1000);



  // Send fetch request to add a new event
  const response = await fetch(`/api/events/userAdd`, {
    method: 'POST',
    body: `
    {
      "id":"${eventId}",
     "title":"${eventName}",
     "link":"https://google.com",
     "geometry":
       {"date":"${eventDate}",
       "type":"Point",
       "coordinates":[${eventLon},${eventLat}]
      }
    }
    `,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    document.location.replace('/');

  } else {
    alert('Failed to add event');

  }
}

document.querySelector('.new-event-form').addEventListener('submit', newFormHandler);
  

//new-event-button function
$("#new-event-btn").on("click", function () {
  $('#map').addClass('pin-drop-mode');
console.log('did we make it');
var theMarker = {};

map.on('click',function(e){
  lat = e.latlng.lat;
  lon = e.latlng.lng;

  console.log("You clicked the map at LAT: "+ lat+" and LONG: "+lon );
      //Clear existing marker, 

      if (theMarker != undefined) {
            map.removeLayer(theMarker);
      };
  //Add a marker to show where you clicked.
   theMarker = L.marker([lat,lon]).addTo(map);
   //opens the new event modal to finish filling out the details
  $("#new-event-modal").removeClass("hidden");
  $("header, #map, main.overlay").addClass("blur");
   });

});