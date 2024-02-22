import * as React from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import RoomIcon from '@mui/icons-material/Room';

function App() {
  const accessToken = import.meta.env.VITE_TOKEN_MAP_BOX;

  return (
    <Map
      mapboxAccessToken={accessToken}
      initialViewState={{
        longitude: -47.9113191,
        latitude: -1.2972993,
        zoom: 12
      }}
      style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      <Marker longitude={-47.9113191} latitude={-1.2972993} anchor="bottom">
        <RoomIcon fontSize='large' color='primary'/>
      </Marker>
    </Map>
  );
}

export default App;
