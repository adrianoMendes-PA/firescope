import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

const Dashboard = () => {
  const [estadoComMaisFocos, setEstadoComMaisFocos] = useState('');
  const [municipioComMaisFocos, setMunicipioComMaisFocos] = useState('');
  const [biomaDoMunicipio, setBiomaDoMunicipio] = useState('');
  const [totalFocosEstado, setTotalFocosEstado] = useState(0);
  const [totalFocosMunicipio, setTotalFocosMunicipio] = useState(0);
  const [totalFocos, setTotalFocos] = useState(0);
  const [dadosChart, setDadosChart] = useState([]);

 useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch('/latest.json');
      const data = await response.json();

      let totalFocos = 0;
      let focosPorEstado = {};
      let focosPorMunicipio = {};
      let focosPorBioma = {};

      // Contagem de focos por estado, município e bioma
      data.forEach(registro => {
        const focosQueimada = parseFloat(registro.frp) / 1000 || 0;
        totalFocos += focosQueimada;

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
        if (focosPorBioma[registro.bioma]) {
          focosPorBioma[registro.bioma] += focosQueimada;
        } else {
          focosPorBioma[registro.bioma] = focosQueimada;
        }
      });

      // Encontrando o estado e município com mais focos
      let estadoComMaisFocos = Object.keys(focosPorEstado).reduce((a, b) => focosPorEstado[a] > focosPorEstado[b] ? a : b);
      let municipioComMaisFocos = Object.keys(focosPorMunicipio).reduce((a, b) => focosPorMunicipio[a] > focosPorMunicipio[b] ? a : b);
      let biomaEncontrado = Object.keys(focosPorBioma).reduce((a, b) => focosPorBioma[a] > focosPorBioma[b] ? a : b); // Corrigido para biomaEncontrado

      const totalFocosEstado = focosPorEstado[estadoComMaisFocos] || 0;
      const totalFocosMunicipio = focosPorMunicipio[municipioComMaisFocos] || 0;

      setEstadoComMaisFocos(estadoComMaisFocos);
      setMunicipioComMaisFocos(municipioComMaisFocos);
      setBiomaDoMunicipio(biomaEncontrado); // Atualizado para biomaEncontrado
      setTotalFocos(totalFocos);

      // Atualizando dados para o gráfico
      setDadosChart([totalFocosEstado, totalFocosMunicipio, totalFocos]);
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
                {new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalFocos)}
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
        {/*<Grid item xs={2} md={4}>
          <Card>
            <CardContent>
              <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom>
                Satélites
              </Typography>
             
            </CardContent>
          </Card>
        </Grid>*/}
      </Grid>
    </Container>
  );
};

export default Dashboard;
