import React, { useEffect, useState } from 'react';
import Map, { NavigationControl, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import './style.css';

function App() {
  const accessToken = import.meta.env.VITE_TOKEN_MAP_BOX;
  const [location, setLocation] = useState({});
  const [burningPoints, setBurningPoints] = useState([]);

  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    const watchID = navigator.geolocation.watchPosition(handlePositionReceived, handlePositionError, options);
    return () => navigator.geolocation.clearWatch(watchID);
  }, []);

  useEffect(() => {
    async function fetchBurningPoints() {
      try {
        const response = await axios.get('/latest.json');

        const points = response.data.map(point => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [point.lon, point.lat]
          },
          properties: {
            municipio: point.municipio,
            estado: point.estado,
            data: point.data_hora_gmt,
            bioma: point.bioma
          }
        }));

        setBurningPoints({
          type: 'FeatureCollection',
          features: points
        });
      } catch (error) {
        console.error('Erro ao carregar os dados de focos de queimadas:', error);
      }
    }

    fetchBurningPoints();
  }, []);

  function handlePositionReceived({ coords }) {
    const { latitude, longitude } = coords;
    setLocation({ latitude, longitude });
  }

  function handlePositionError(error) {
    console.error("Erro ao obter a localização:", error);
  }

  const heatmapLayer = {
    id: 'burning-points-heat',
    type: 'heatmap',
    paint: {
      // Ajusta a intensidade do calor
      'heatmap-intensity': {
        stops: [
          [5, 1],
          [15, 3]
        ]
      },
      // Ajusta o raio do calor em função do zoom
      'heatmap-radius': {
        stops: [
          [5, 15],
          [15, 20]
        ]
      },
      // Ajusta a opacidade do calor
      'heatmap-opacity': {
        stops: [
          [14, 0.5],
          [15, 0.3]
        ]
      }
    }
  };

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

          <Source id="burning-points" type="geojson" data={burningPoints}>
            <Layer {...heatmapLayer} />
          </Source>
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