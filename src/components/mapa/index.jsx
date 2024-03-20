import React, { useEffect, useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import RoomIcon from '@mui/icons-material/Room';
import FireIcon from '@mui/icons-material/Whatshot'
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

function App() {
  const accessToken = import.meta.env.VITE_TOKEN_MAP_BOX;
  const [location, setLocation] = useState({});
  const [burningPoints, setBurningPoints] = useState([]);

  useEffect(() => {
    const watchID = navigator.geolocation.watchPosition(handlePositionReceived);
    return () => navigator.geolocation.clearWatch(watchID);
  }, []);

  useEffect(() => {
    // Função para carregar e processar os dados de focos de queimadas
    async function fetchBurningPoints() {
      try {
        // Carregar o arquivo JSON localmente usando o Axios
        const response = await axios.get('/latest.json');

        // Extrair os dados de focos de queimadas do objeto de resposta
        const points = response.data.map(point => ({
          lat: point.lat,
          lon: point.lon
        }));

        // Atualizar o estado com os focos de queimadas
        setBurningPoints(points);
      } catch (error) {
        console.error('Erro ao carregar os dados de focos de queimadas:', error);
      }
    }

    // Chamar a função para carregar os dados de focos de queimadas
    fetchBurningPoints();
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
            zoom: 5
          }}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          scrollZoom={true}
        >
          <NavigationControl style={{ marginTop: '80px' }} />

          {/* Adicionar marcadores para cada foco de queimada */}
          {burningPoints.map((point, index) => (
            <Marker key={index} longitude={point.lon} latitude={point.lat} anchor="bottom">
              <FireIcon fontSize='large' color='error' />
            </Marker>
          ))}
          <Marker longitude={location.longitude} latitude={location.latitude} anchor="bottom">
            <RoomIcon fontSize='large' color='primary' />
          </Marker>
        </Map>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', flexDirection: 'column' }}>
          <div style={{ marginBottom: '15px' }}>
            <p style={{ textAlign: 'center' }}>Carregando mapa...</p>
          </div>
          <Box>
            <CircularProgress />
          </Box>
        </div>
      )}
    </>
  );
}

export default App;