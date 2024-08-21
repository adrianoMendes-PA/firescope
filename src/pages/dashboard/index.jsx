import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

const Dashboard = () => {
  const [estadoComMaisFocos, setEstadoComMaisFocos] = useState('');
  const [municipioComMaisFocos, setMunicipioComMaisFocos] = useState('');
  const [biomaDoMunicipio, setBiomaDoMunicipio] = useState('');
  const [totalFocos, setTotalFocos] = useState(0);
  const [dadosChart, setDadosChart] = useState([0, 0, 0, 0]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/latest.json');
        const data = await response.json();

        let totalFocosEstado = 0;
        let totalFocosMunicipio = 0;
        let totalFocosBioma = 0;
        let maxFocos = 0;
        let estadoEncontrado = '';
        let municipioEncontrado = '';
        let biomaEncontrado = '';

        // Inicializando um mapa para contar os focos de cada categoria
        let focosPorEstado = {};
        let focosPorMunicipio = {};
        let focosPorBioma = {};

        data.forEach(registro => {
          const focosQueimada = parseFloat(registro.frp) / 1000 || 0;

          if (focosQueimada > maxFocos) {
            maxFocos = focosQueimada;
            estadoEncontrado = registro.estado;
            municipioEncontrado = registro.municipio;
            biomaEncontrado = registro.bioma;
          }

          // Contagem de focos por estado
          if (focosPorEstado[registro.estado]) {
            focosPorEstado[registro.estado] += focosQueimada;
          } else {
            focosPorEstado[registro.estado] = focosQueimada;
          }

          // Contagem de focos por município
          if (focosPorMunicipio[registro.municipio]) {
            focosPorMunicipio[registro.municipio] += focosQueimada;
          } else {
            focosPorMunicipio[registro.municipio] = focosQueimada;
          }

          // Contagem de focos por bioma
          // if (focosPorBioma[registro.bioma]) {
          //   focosPorBioma[registro.bioma] += focosQueimada;
          // } else {
          //   focosPorBioma[registro.bioma] = focosQueimada;
          // }
        });

        totalFocosEstado = focosPorEstado[estadoEncontrado] || 0;
        totalFocosMunicipio = focosPorMunicipio[municipioEncontrado] || 0;
        totalFocosBioma = focosPorBioma[biomaEncontrado] || 0;

        setEstadoComMaisFocos(estadoEncontrado);
        setMunicipioComMaisFocos(municipioEncontrado);
        setBiomaDoMunicipio(biomaEncontrado);
        setTotalFocos(maxFocos);

        setDadosChart([totalFocosEstado, totalFocosMunicipio, maxFocos]);
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
                {totalFocos.toFixed(3)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={4}>
        <Grid item xs={12} md={8}>
          <BarChart
            xAxis={[
              {
                id: 'barCategories',
                data: [estadoComMaisFocos, municipioComMaisFocos, 'Total de focos'],
                scaleType: 'band',
              },
            ]}
            series={[
              {
                data: dadosChart,
              },
            ]}
            width={800}
            height={400}
            margin={{ top: 20, bottom: 50, left: 60, right: 50 }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom>
                Satélites
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;