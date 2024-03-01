import React, { useEffect, useState } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import RoomIcon from '@mui/icons-material/Room';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

function App() {
  const accessToken = import.meta.env.VITE_TOKEN_MAP_BOX;
  const [location, setLocation] = useState({});

  useEffect(() => {
    const watchID = navigator.geolocation.watchPosition(handlePositionReceived);
    return () => navigator.geolocation.clearWatch(watchID);
  }, []);

  function handlePositionReceived({ coords }) {
    const { latitude, longitude } = coords;
    setLocation({ latitude, longitude });
  }

  return (
    <>
      {location.latitude && location.longitude ? (
        <Map
          mapboxAccessToken={accessToken}
          initialViewState={{
            longitude: location.longitude,
            latitude: location.latitude,
            zoom: 12
          }}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
        >
          <Marker longitude={location.longitude} latitude={location.latitude} anchor="bottom">
            <RoomIcon fontSize='large' color='primary' />
          </Marker>
        </Map>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', flexDirection: 'column' }}>
          {/* <div style={{ marginBottom: '15px' }}>
            <p style={{ textAlign: 'center' }}>Carregando mapa</p>
          </div> */}
          <Box style={{ width: '50%' }}>
            <LinearProgress />
          </Box>
        </div>
      )}
    </>
  );
}

export default App;
