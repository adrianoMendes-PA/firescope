import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';

const Dashboard = () => {
  const [estadoComMaisFocos, setEstadoComMaisFocos] = useState('');
  const [municipioComMaisFocos, setMunicipioComMaisFocos] = useState('');
  const [biomaDoMunicipio, setBiomaDoMunicipio] = useState('');

  useEffect(() => {
    
    async function fetchData() {
      try {
        const response = await fetch('/latest.json');
        const data = await response.json();

        // Inicializando variáveis para armazenar o estado, município e bioma com mais focos de queimada
        let maxFocos = 0;
        let estadoEncontrado = "";
        let municipioEncontrado = "";
        let biomaEncontrado = "";

        // Iterando sobre os registros no array
        data.forEach(registro => {
          const focosQueimada = parseFloat(registro.frp) || 0;

          if (focosQueimada > maxFocos) {
            maxFocos = focosQueimada;
            estadoEncontrado = registro.estado;
            municipioEncontrado = registro.municipio;
            biomaEncontrado = registro.bioma;
          }
        });

        // Atualizando os estados
        setEstadoComMaisFocos(estadoEncontrado);
        setMunicipioComMaisFocos(municipioEncontrado);
        setBiomaDoMunicipio(biomaEncontrado);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <Card>
            <CardContent>
              <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom>
                Estado
              </Typography>
              <Typography variant="body2">
                {estadoComMaisFocos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={4}>
          <Card>
            <CardContent>
              <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom>
                Município
              </Typography>
              <Typography variant="body2">
                {municipioComMaisFocos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={4}>
          <Card>
            <CardContent>
              <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom>
                Bioma
              </Typography>
              <Typography variant="body2">
                {biomaDoMunicipio}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;