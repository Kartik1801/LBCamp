console.log(campground.geometry)
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: campground.geometry.coordinates, // centerstarting position [lng, lat]
  zoom: 10 // starting zoom
  });
 const marker1 = new mapboxgl.Marker()
 .setLngLat(campground.geometry.coordinates)
 .addTo(map);