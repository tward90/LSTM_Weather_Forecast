// Create mymap constant

const mymap = L.map('mapid', {
    center:[29.7604, -95.3698],
    zoom: 9
});

// Add a tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
}).addTo(mymap);

// An array containing each Station's name, location, elevation and callsign if applicable
const stations = [{
    location: [29.717,	-95.383],
    name: "HOUSTON/DUNN HELISTOP",
    callsign: "KMCJ",
    elevation: "69"
  },
  {
    location: [29.506,	-95.477],
    name: "HOUSTON SOUTHWEST AIRPORT",
    callsign: "KAXH",
    elevation: "20.7"
  },
  {
    location: [29.818,	-95.673],
    name: "WEST HOUSTON",
    callsign: "KIWS",
    elevation: "33.8"
  },
  {
    location: [29.638,	-95.282],
    name: "WILLIAM P. HOBBY AIRPORT",
    callsign: "KHOU",
    elevation: "13.4"
  },
  {
    location: [29.6,	-95.167],
    name: "HOUSTON/ELLINGTON",
    callsign: "KEFD",
    elevation: "10"
  },
  {
    location: [30.067,	-95.55],
    name: "HOUSTON/D.W. HOOKS",
    callsign: "KDWH",
    elevation: "46"
  },
  {
    location: [29.617,	-95.65],
    name: "SUGAR LAND REGIONAL ARPT",
    callsign: "KSGR",
    elevation: "25"
  },
  {
    location: [29.726,	-95.266],
    name: "MANCHESTER",
    elevation: "10",
    callsign:"N/A"
  },
  {
    location: [29.519,	-95.242],
    name: "CLOVER FIELD AIRPORT",
    callsign: "KLVJ",
    elevation: "13.4"
  },
  {
    location: [29.98,	-95.36],
    name: "G BUSH INTERCONTINENTAL AP/HO",
    callsign: "KIAH",
    elevation: "29"
  }
  ];

var weatherIcon = L.icon({
    iconUrl: '../../templates/Assets/flash.svg',
    iconSize:     [38, 45], // size of the icon
    iconAnchor:   [19, 45], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

  stations.forEach( station => {
    L.marker(station.location, {icon: weatherIcon})
      .bindPopup("<h4>" + station.name + "</h4> <hr> <h5>Airport Callsign: " + station.callsign + "</h5> <hr> <h5>Elevation: " + station.elevation + "</h5>")
      .addTo(mymap);
  })