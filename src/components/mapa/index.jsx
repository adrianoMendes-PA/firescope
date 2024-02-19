import * as React from 'react';
import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {

    const accessToken = process.env.REACT_APP_ACCESS_TOKEN_MAP_BOX;

    return (
        <Map
            mapboxAccessToken={accessToken}
            initialViewState={{
                longitude: -47.9113191,
                latitude: -1.2972993,
                zoom: 12
            }}
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
            mapStyle="mapbox://styles/mapbox/satellite-v9"
        />
    );
}

export default App;