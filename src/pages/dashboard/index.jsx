import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

const Dashboard = () => {
  const [estadoComMaisFocos, setEstadoComMaisFocos] = useState('');
  const [municipioComMaisFocos, setMunicipioComMaisFocos] = useState('');
  const [biomaDoMunicipio, setBiomaDoMunicipio] = useState('');
  const [totalFocos, setTotalFocos] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/latest.json');
        const data = await response.json();

        let maxFocos = 0;
        let estadoEncontrado = "";
        let municipioEncontrado = "";
        let biomaEncontrado = "";

        data.forEach(registro => {
          const focosQueimada = parseFloat(registro.frp) || 0;

          if (focosQueimada > maxFocos) {
            maxFocos = focosQueimada;
            estadoEncontrado = registro.estado;
            municipioEncontrado = registro.municipio;
            biomaEncontrado = registro.bioma;
          }
        });

        setEstadoComMaisFocos(estadoEncontrado);
        setMunicipioComMaisFocos(municipioEncontrado);
        setBiomaDoMunicipio(biomaEncontrado);
        setTotalFocos(maxFocos);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
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
        <Grid item xs={6} md={3}>
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
        <Grid item xs={6} md={3}>
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
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom>
                Total de focos
              </Typography>
              <Typography variant="body2">
                {totalFocos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={4}>
        <Grid item xs={12}>
          <BarChart
            xAxis={[
              {
                id: 'barCategories',
                data: ['Estado', 'Município', 'Bioma', 'Total de focos'],
                scaleType: 'band',
              },
            ]}
            series={[
              {
                data: [1, 1, 1, totalFocos],
                color: ['#1976d2', '#1976d2', '#1976d2', '#d32f2f']
              },
            ]}
            width={500}
            height={300}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
