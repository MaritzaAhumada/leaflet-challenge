
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Part 1

let layerEarthquake = L.layerGroup()



d3.json(url)
  .then(data => {
    data.features.forEach(earthquake => {
      const place = earthquake.properties.place;
      const [lon, lat, depth] = earthquake.geometry.coordinates;
      const magnitude = earthquake.properties.mag;

      L.circleMarker([lat, lon], {
        radius: magnitude * 4,
        fillColor: depth < 10 ? '#00ff00' : depth < 30 ? '#ffff00' : depth < 70 ? '#ffa500' : '#ff0000', 
        color: "#000",
        weight: 0.5,
        fillOpacity: 0.8
      })
      .bindPopup(`Location: ${place}<br>Magnitude: ${magnitude}<br>Depth: ${depth} km`)
      .addTo(layerEarthquake);
    });
  })
  .catch(error => console.error('Error fetching data:', error));



  let myMap = L.map("map").setView([20, 0], 1);


  layerEarthquake.addTo(myMap)



  // part 2

let stMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let toMap = L.tileLayer('https://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.stamen.com">Stamen Toner</a>'
});

let baseMaps = {
    "Street Map": stMap,
    "Toner Map" : toMap
};

stMap.addTo(myMap)


let tectonicUrl = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';

layerTectonicPlates = L.layerGroup();


d3.json(tectonicUrl)
  .then(tectonicPlates => {
    L.geoJson(tectonicPlates, {
      style: {
        color: '#ff7900', 
        weight: 2,
        opacity: 0.65
      }
    }).addTo(layerTectonicPlates);
  })
  .catch(error => console.error('Error fetching tectonic plates :', error));


  let overlayMaps = {
    "Earthquakes": layerEarthquake,
    "Tectonic Plates" : layerTectonicPlates
  }


  layerTectonicPlates.addTo(myMap);

  L.control.layers(baseMaps, overlayMaps).addTo(myMap);