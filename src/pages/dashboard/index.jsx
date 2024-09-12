import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

const Dashboard = () => {
  const [estadoComMaisFocos, setEstadoComMaisFocos] = useState('');
  const [municipioComMaisFocos, setMunicipioComMaisFocos] = useState('');
  const [biomaMaisAfetado, setBiomaMaisAfetado] = useState('');
  const [totalFocos, setTotalFocos] = useState(0);
  const [dadosChart, setDadosChart] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/latest.json');
        const data = await response.json();

        // Contagem total de focos de queimadas
        const totalFocos = data.length;

        // Contagem de focos por estado
        const focosPorEstado = data.reduce((acc, queimada) => {
          acc[queimada.estado] = (acc[queimada.estado] || 0) + 1;
          return acc;
        }, {});

        // Encontrando o estado com mais focos
        const estadoComMaisFocos = Object.keys(focosPorEstado).reduce((a, b) => focosPorEstado[a] > focosPorEstado[b] ? a : b);

        // Contagem de focos por município
        const focosPorMunicipio = data.reduce((acc, queimada) => {
          acc[queimada.municipio] = (acc[queimada.municipio] || 0) + 1;
          return acc;
        }, {});

        // Encontrando o município com mais focos
        const municipioComMaisFocos = Object.keys(focosPorMunicipio).reduce((a, b) => focosPorMunicipio[a] > focosPorMunicipio[b] ? a : b);

        // Contagem de focos por bioma
        const focosPorBioma = data.reduce((acc, queimada) => {
          acc[queimada.bioma] = (acc[queimada.bioma] || 0) + 1;
          return acc;
        }, {});

        // Encontrando o bioma mais afetado
        const biomaMaisAfetado = Object.keys(focosPorBioma).reduce((a, b) => focosPorBioma[a] > focosPorBioma[b] ? a : b);

        // Atualizando estados
        setEstadoComMaisFocos(estadoComMaisFocos);
        setMunicipioComMaisFocos(municipioComMaisFocos);
        setBiomaMaisAfetado(biomaMaisAfetado);
        setTotalFocos(totalFocos);

        // Atualizando dados para o gráfico
        setDadosChart([focosPorEstado[estadoComMaisFocos], focosPorMunicipio[municipioComMaisFocos], totalFocos]);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <Container>
      <Grid container spacing={2}>
         <Typography variant="h4" align="center">
          Estado, município e bioma mais afetados por focos de queimadas
        </Typography>
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
                {biomaMaisAfetado}
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
                {new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(totalFocos)}
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
      </Grid>
    </Container>
  );
};

export default Dashboard;
