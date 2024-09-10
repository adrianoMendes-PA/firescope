import React, { useEffect, useState, useRef } from 'react';
import Map, { NavigationControl, Source, Layer, Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PersonPinCircleSharpIcon from '@mui/icons-material/PersonPinCircleSharp';
import MyLocationIcon from '@mui/icons-material/MyLocation'; // Ícone de localização
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import './style.css';

function App() {
  const accessToken = import.meta.env.VITE_TOKEN_MAP_BOX;
  const [location, setLocation] = useState({});
  const [burningPoints, setBurningPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const mapRef = useRef(); // Referência ao mapa

  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handlePositionReceived(position);
      },
      (error) => {
        handlePositionError(error);
      },
      options
    );

    const watchID = navigator.geolocation.watchPosition(
      (position) => {
        if (position.coords.accuracy > 10) {
          console.log("Baixa precisão, aguardando por uma posição melhor...");
          return;
        }
        handlePositionReceived(position);
      },
      handlePositionError,
      options
    );

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
            id: point.id,
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
      'heatmap-intensity': {
        stops: [
          [5, 1],
          [15, 3]
        ]
      },
      'heatmap-radius': {
        stops: [
          [5, 15],
          [15, 20]
        ]
      },
      'heatmap-opacity': {
        stops: [
          [14, 0.5],
          [15, 0.3]
        ]
      }
    }
  };

  const circleLayer = {
    id: 'burning-points-circle',
    type: 'circle',
    paint: {
      'circle-radius': 5,
      'circle-color': 'rgba(0, 0, 0, 0)',
      'circle-stroke-width': 1,
      'circle-stroke-color': 'rgba(0, 0, 0, 0)'
    }
  };

  function handleMapClick(event) {
    const features = event.features;
    if (features.length) {
      const feature = features[0];
      setSelectedPoint({
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        municipio: feature.properties.municipio,
        estado: feature.properties.estado,
        data: feature.properties.data,
        bioma: feature.properties.bioma
      });

      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
          essential: true
        });
      }
    }
  }

  // Funções para alterar o cursor ao passar por um foco de queimada
  function handleMouseEnter() {
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor = 'pointer';
    }
  }

  function handleMouseLeave() {
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor = '';
    }
  }

  // Função para voltar à localização do usuário
  function handleReturnToLocation() {
    if (location.latitude && location.longitude && mapRef.current) {
      mapRef.current.flyTo({
        center: [location.longitude, location.latitude],
        zoom: 8, // Nível de zoom que você deseja ao voltar para a localização
        essential: true
      });
    }
  }

  return (
    <>
      {location.latitude && location.longitude ? (
        <Map
          ref={mapRef}
          mapboxAccessToken={accessToken}
          initialViewState={{
            longitude: location.longitude,
            latitude: location.latitude,
            zoom: 8
          }}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          scrollZoom={true}
          interactiveLayerIds={['burning-points-circle']}
          onClick={handleMapClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <NavigationControl style={{ marginTop: '80px' }} />

          <Source id="burning-points" type="geojson" data={burningPoints}>
            <Layer {...heatmapLayer} />
            <Layer {...circleLayer} />
          </Source>

          {selectedPoint && (
            <Popup
              longitude={selectedPoint.longitude}
              latitude={selectedPoint.latitude}
              onClose={() => setSelectedPoint(null)}
              closeOnClick={false}
              anchor="bottom"
              className="custom-popup"
            >
              <div>
                <h2>Informações sobre as queimadas</h2>
                <h4>Município: {selectedPoint.municipio}</h4>
                <h4>Estado: {selectedPoint.estado}</h4>
                <h4>Data: {new Date(selectedPoint.data).toLocaleString()}</h4>
                <h4>Bioma: {selectedPoint.bioma}</h4>
              </div>
            </Popup>
          )}

          {/* Marcador da sua localização */}
          <Marker
            longitude={location.longitude}
            latitude={location.latitude}
            anchor="bottom"
          >
            <PersonPinCircleSharpIcon fontSize='large' color='warning' />
          </Marker>

          {/* Ícone para voltar à localização do usuário */}
          <div style={{ position: 'absolute', top: 90, left: 10 }}>
            <MyLocationIcon
              fontSize="large"
              color="primary"
              onClick={handleReturnToLocation}
              style={{ cursor: 'pointer' }}
            />
          </div>
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
