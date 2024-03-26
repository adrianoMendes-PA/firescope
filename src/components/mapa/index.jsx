import React, { useEffect, useState } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import RoomIcon from '@mui/icons-material/Room';
import FireIcon from '@mui/icons-material/LocalFireDepartmentOutlined'
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { format } from 'date-fns';

function App() {
  const accessToken = import.meta.env.VITE_TOKEN_MAP_BOX;
  const [location, setLocation] = useState({});
  const [burningPoints, setBurningPoints] = useState([]);
  const [selectedBurningPoint, setSelectedBurningPoint] = useState(null);

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
    // Função para carregar e processar os dados de focos de queimadas
    async function fetchBurningPoints() {
      try {
        // Carrega o arquivo JSON usando a rota de servidor
        const response = await axios.get('/latest.json');

        // Extrai os dados de focos de queimadas do objeto de resposta
        const points = response.data.map(point => ({
          id: point.id,
          lat: point.lat,
          lon: point.lon,
          municipio: point.municipio,
          estado: point.estado,
          data: point.data_hora_gmt,
          bioma: point.bioma
        }));

        // Atualiza o estado com os focos de queimadas
        setBurningPoints(points);
      } catch (error) {
        console.error('Erro ao carregar os dados de focos de queimadas:', error);
      }
    }

    // Chama a função para carregar os dados de focos de queimadas
    fetchBurningPoints();
  }, []);

  function handlePositionReceived({ coords }) {
    const { latitude, longitude } = coords;
    setLocation({ latitude, longitude });
  }

  function handlePositionError(error) {
    console.error("Erro ao obter a localização:", error);
  }

  function handleMarkerClick(burningPointId) {
    setSelectedBurningPoint(burningPointId);
  }

  function closePopup() {
    setSelectedBurningPoint(null);
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

          {/* Adiciona marcadores para cada foco de queimada */}
          {burningPoints.map((point, index) => (
            <Marker key={point.id} longitude={point.lon} latitude={point.lat} anchor="center">
              <FireIcon fontSize='large' color='error' onClick={() => handleMarkerClick(point.id)} />
              {selectedBurningPoint === point.id && (
                <Popup
                  longitude={point.lon}
                  latitude={point.lat}
                  onClose={closePopup}
                  closeOnClick={false}
                  anchor="bottom"
                >
                  <div>
                    {/* Informações adicionais sobre a queimada*/}
                    <h3>Informações sobre a queimada</h3>
                    <h4>Município: {point.municipio}</h4>
                    <h4>Estado: {point.estado}</h4>
                    <h4>Data: {format(new Date(point.data), 'dd/MM/yyyy')} às {format(new Date(point.data), 'HH:mm:ss')}</h4>
                    <h4>Bioma: {point.bioma}</h4>
                  </div>
                </Popup>
              )}
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
