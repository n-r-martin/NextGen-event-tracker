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
checkboxAll = $('#checkbox-all');
singleEventTypeCheckbox = $('.single-event-type');

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
checkboxAll.on('change', function () {
   if (!$(this).is(':checked')) {
      singleEventTypeCheckbox.each(function () {
         if ($(this).prop('checked', true)) {
            $(this).prop('checked', false);
         }
      })
   } else {
      singleEventTypeCheckbox.each(function () {
         $(this).prop('checked', true);
      })
   }
   dataRefreshBtn.attr('disabled', false);
})

singleEventTypeCheckbox.on('change', function () {
   if ($('.single-event-type:checked').length == singleEventTypeCheckbox.length) {
      checkboxAll.prop('checked', true);
   }

   if (!$(this).is(':checked')) {
      checkboxAll.prop('checked', false);
   }

   dataRefreshBtn.attr('disabled', false);
})

// This function fetches event data from the EONET API and uses it to populate the event markers on the map
async function dataPull() {
   //set date variables based on datepicker values
   dateStart = dateFrom.value;
   dateEnd = dateTo.value;

   // Looking at the checkboxes and if all or one is checked, push that event type to eventTypesArr which then is passed to the API call
   let eventTypesArr = [];
   if (checkboxAll.is(':checked')) {
      eventTypesArr = [];
   } else {
      singleEventTypeCheckbox.each(function () {
         if ($(this).is(':checked')) {
            eventTypesArr.push($(this).attr('data-event-type'));
         };
      });
   }
   
   if (dateEnd >= dateStart) {
      //--original code: let queryEONET = `https://eonet.sci.gsfc.nasa.gov/api/v3/events?bbox=${minLong},${maxLat},${maxLong},${minLat}&start=${dateStart}&end=${dateEnd}&category=${eventTypesArr}&limit=${eventCount}&status=all`;
      const queryEONET = `/api/events/eonet`
      const queryUSGS = `/api/events/usgs`
      let eventsCount = 0;
      let objAry = {};
      // console.log(`objAry is: ${JSON.stringify(objAry)}`);
      objAry = {minLong: `${minLong}`,
         maxLat:`${maxLat}`,
         maxLong:`${maxLong}`,
         minLat:`${minLat}`,
         dateStart:`${dateStart}`,
         dateEnd:`${dateEnd}`,
         eventTypesArr:`${eventTypesArr}`,
         eventCount:`${eventCount}`};
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
      if (!(eventTypesArr.includes('earthquakes') && eventTypesArr.length === 1)){
         displayMessage(`PROCESSING EONET EVENT DATA...`);
         await fetch (queryEONET, {
            method: 'POST',
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(objAry)
         })
         .then(async res => await res.json())
         .then(async usgsData => {
            console.log(`eonetData is: ${usgsData}`);
            var pointList = [];
            var polygonPoints = [];
            let eventData = usgsData;
            console.log(eventData);
            if (eventData.length > 0) {
               for (let index = 0; index < eventData.length; index++) {
                  if (usgsData[index].geometry[0].type !== "Polygon") {
                     if (usgsData[index].geometry.length > 2) {
                        //build polyline points array
                        for (let i = 0; i < usgsData[index].geometry.length; i++) {
                           pointList.push(new L.LatLng(usgsData[index].geometry[i].coordinates[1], usgsData[index].geometry[i].coordinates[0]));
                        };
                        //add polyline to map
                        var drawPolyline = new L.polyline(pointList, {
                           color: 'red',
                           weight: 2,
                           opacity: 0.25,
                           smoothFactor: 1
                        });
                        drawPolyline.addTo(layerGroup);
                        pointList = [];
                     };
                     var date = new Date(usgsData[index].geometry[0].date);
                     var eventMarker = L.marker([usgsData[index].geometry[0].coordinates[1], usgsData[index].geometry[0].coordinates[0]]);
                     eventMarker.addTo(layerGroup)
                       //marker description with date
                        .bindPopup(`${usgsData[index].title} -\n Date/Time: ${date.toString()}`); 
                  }
                  else {
                     for (let i = 0; i < usgsData[index].geometry[0].coordinates[0].length; i++) {
                        polygonPoints.push([usgsData[index].geometry[0].coordinates[0][i][1], usgsData[index].geometry[0].coordinates[0][i][0]]);
                     };
                     var polygon = new L.polygon(polygonPoints, {
                        color: 'orange',
                        opacity: 0.25,
                     });
                     polygon.addTo(layerGroup);
                     polygonPoints = [];
                  };
               }
               eventsCount += eventData.length;
               displayMessage(`${eventsCount} matching event(s) found between ${dateStart} and ${dateEnd}`);
               return;
            } else {
               displayMessage(`No matching events found in this area between ${dateStart} and ${dateEnd}`);
               return;
            };
         });
      };
      if (eventTypesArr.includes('earthquakes') || eventTypesArr.length === 0){
//-------------START USGS EARTHQUAKE-------------//
         displayMessage(`PROCESSING EARTHQUAKE DATA...`);
         await fetch (queryUSGS, {
            method: 'POST',
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(objAry)
         })
         .then(async res => await res.json())
         .then(async usgsData => {
            console.log(`usgsData is: ${usgsData}`);
            let eventData = usgsData;
            console.log(eventData);
            if (eventData.length > 0) {
               for (let index = 0; index < eventData.length; index++) {
                  if (usgsData[index].geometry.type !== "Polygon") {
                     let date = new Date(usgsData[index].properties.time);
                     var eventMarker = L.marker([usgsData[index].geometry.coordinates[1], usgsData[index].geometry.coordinates[0]]);
                     //* Credit: earthquake radius calculation - https://www.cqsrg.org/tools/perceptionradius/
                     //* Calculates the preception radius Rp in km of at an earthquake of magnitude y using the Kevin McCue formula y ~ 1.01 ln(Rp) + 0.13.
                     let radius = Math.floor(Math.exp(usgsData[index].properties.mag/1.01 - 0.13 ) * 1000  + 0.5);
                     // console.log(`Radius is: ${radius}`);
                     let eventRadius = L.circle([usgsData[index].geometry.coordinates[1], usgsData[index].geometry.coordinates[0]], {
                        color: 'orange',
                        opacity: 0.10,
                     });
                     let eventLink = `<a href="${usgsData[index].properties.url}"target="_blank">More Info</a>`
                     eventRadius.addTo(layerGroup)
                        .setRadius(radius);
                     eventMarker.addTo(layerGroup)
                       //marker description with date
                        .bindPopup(`Earthquake - ${usgsData[index].properties.title} -\n Date/Time: ${date.toUTCString()} -\n ${eventLink}`); 
                  };
               };
               eventsCount += eventData.length;
               displayMessage(`${eventsCount} matching event(s) found between ${dateStart} and ${dateEnd}`);
               return;
            } else {
               displayMessage(`${eventsCount} matching event(s) found between ${dateStart} and ${dateEnd}`);
               return;
            };
         });
//-------------END USGS EARTHQUAKE-------------//
         return;
      } else {
         displayMessage(`${eventsCount} matching event(s) found between ${dateStart} and ${dateEnd}`);
      return;
      };
      return;
   };
   return;
};


// Getting the city coordinates based on user entry in the city search bar
async function getCityCoord(event) {
   event.preventDefault();

   // get city name
   // let newCity = searchText.value;
//-----NEW CODE-----//
   const cityTextInput = document.querySelector('#search-city').value.trim();

   if (cityTextInput) {
      const response = await fetch(`/api/getaddress/${cityTextInput}`, {
        method: 'GET',
      //   body: JSON.stringify({ commentContent, postID }),
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      })
      .then(async response => {
         if (response.ok) {
             await response.json().then(function (data) {
                if (data.message === 'ok'){
                  console.log(data);
                  console.log(data.message);
                  console.log(data.lat);
                  console.log(data.lon);
                  const lat = data.lat;
                  const lon = data.lon;
                  L.marker([lat, lon])
                     .addTo(layerGroup)
                     .bindPopup(`${cityTextInput}`); // add marker
                  map.setView([lat, lon], 10) //set map to location, zoom to 10
                  localStorage.setItem("Lat", lat);
                  localStorage.setItem("Lon", lon);
                  dataPull();
                  return;
                }
                else {
                  alert('Not a valid city');
                }

             })
         }
         else {
            alert('Failed to retrieve city');
         };
     });
   };
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
};

// Data Refresh Function
function dataRefresh() {

   //clear all existing point
   layerGroup.clearLayers();

   // Pull new data
   dataPull();
};


// Function for toggling visibility of the options menu
function menuToggleHide() {
   var optionsMenu = $('#option-menu');
   var loginBtn = $('#login-btn');
   var velocity = 200;

   if (optionsMenu.css('display') === 'none') {
      optionsMenu.toggle("slide", {direction: "right", easing: "linear"}, velocity);
      loginBtn.animate({right: '308px'}, {duration: velocity, easing: "linear" });
   } else {
      optionsMenu.toggle("slide", {direction: "right", easing: "linear"}, velocity);
      loginBtn.animate({right: '64px'}, {duration: velocity, easing: "linear" }); 
      };
   };

// $( "#clickme" ).click(function() {
//    $( "#book" ).animate({
//      width: "toggle",
//      height: "toggle"
//    }, {
//      duration: 5000,
//      specialEasing: {
//        width: "linear",
//        height: "easeOutBounce"
//      }
//    });
//  });


// Function to open the modals
function openModal(evt) {
   $('.modal').removeClass('hidden');
   $('header, #map, main.overlay').addClass('blur');

   let selectedModal = evt.target.getAttribute('data-modal');

   $('.modal-header h2').text(selectedModal);
};

// Function to close the currently opened modal
function closeModal() {
   $('.modal').addClass('hidden');
   $('header, #map, main.overlay').removeClass('blur');
}


//function to get lat/lon from local storage
function getStoredLocation() {
   storedLat = localStorage.getItem("Lat");
   storedLon = localStorage.getItem("Lon");

   if (localStorage.getItem('Lat') === null) {
      localStorage.setItem('Lat', 39.85);
   }
   if (localStorage.getItem('Lon') === null) {
      localStorage.setItem('Lon', -104.67);
   }
}

///// Creating the map /////
function createMap() {

   map = L.map('map', {
      tap:false,
   center: new L.latLng(storedLat, storedLon),
   dragging: true,
   gestureHandling: "cooperative",
   zoom: 12});
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
   let dd = String(today.getDate()).padStart(2, '0');
   let mm = String(today.getMonth() + 1).padStart(2, '0');
   let yyyy = today.getFullYear();
   today = yyyy + '-' + mm + '-' + dd;
   //get today's date minus 30 days 
   let todayMinus = new Date();
   todayMinus.setDate(todayMinus.getDate() - 90); // today minus 30 days
   dd = String(todayMinus.getDate()).padStart(2, '0');
   mm = String(todayMinus.getMonth() + 1).padStart(2, '0');
   yyyy = todayMinus.getFullYear();
   todayMinus = yyyy + '-' + mm + '-' + dd;
   // set default date
   dateStart = todayMinus;
   dateEnd = today;
   dateFrom.value = todayMinus;
   dateTo.value = today;
   // future date restriction
   dateFrom.setAttribute("max", today);
   dateTo.setAttribute("max", today);
};

function displayMessage(string) {
   errorHandle.classList.remove("hide");
   errorHandle.textContent = string;
};

//running init functions now so event handlers can recognize them
//getStoredLocation and setDatePicker are running in and out of init, because we couldn't get them to run synchronously, and we need the variables set in them to be used in createMap and dataPull

    getStoredLocation();
    setDatePicker();
    init();



     ////// EVENT HANDLERS //////

// Map move event -- triggers new boundaries
map.on('moveend', function () {
    dataRefreshBtn.attr('disabled', false);
    getNewBoundaries();
 });
 
 //Open Modals
 $('#help-btn').on('click', function () {
    $('#help-modal').removeClass('hidden');
    $('header, #map, main.overlay').addClass('blur');
 })
 
 $('#about-btn').on('click', function () {
    $('#about-modal').removeClass('hidden');
    $('header, #map, main.overlay').addClass('blur');
 })

 $('#login-btn').on('click', function () {
   $('#login-modal').removeClass('hidden');
   $('header, #map, main.overlay').addClass('blur');
})
 
 // Close Modal
 $('.modal-close-btn').on('click', closeModal);
 $('.modal-background').on('click', closeModal);
 
 // Prevents clicking through the modal container and onto to back to close it
 $('.modal-container').on('click', function (evt) {
    evt.stopPropagation();
 });
 
 // Search City Event
 $("#search-bar").on("submit", function (event) {
    getCityCoord(event);
    $("#search-city").val("");
 });
 
 // Refresh Data Event
 dataRefreshBtn.on("click", function () {
    dataRefreshBtn.attr('disabled', true);
    dataRefresh();
    let mapCenter = [(minLat + maxLat) / 2, (minLong + maxLong) / 2];
    localStorage.setItem("Lat", mapCenter[0]);
    localStorage.setItem("Lon", mapCenter[1]);
 });
 
 //Open Options Menu
 $('#menu-open-btn').on('click', menuToggleHide);
 
 //Close Options Menu
 $('#menu-close-btn').on('click', menuToggleHide);
 
 //Set toDate after fromDate chosen
 $("#to").on('click', function (event) {
    const minDate = dateFrom.value;
    dateTo.setAttribute("min", minDate);
 });
