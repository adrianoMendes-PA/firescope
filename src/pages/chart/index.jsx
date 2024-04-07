import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const Chart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/public/latest.json');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Erro ao carregar os dados:', error);
            }
        };

        fetchData();
    }, []);

    // Processar os dados para contar o número de queimadas por estado e município
    const countQueimadasPorEstado = () => {
        const queimadasPorEstado = {};

        data.forEach(queimada => {
            const estado = queimada.estado;
            if (!queimadasPorEstado[estado]) {
                queimadasPorEstado[estado] = 1;
            } else {
                queimadasPorEstado[estado]++;
            }
        });

        return queimadasPorEstado;
    };

    const countQueimadasPorMunicipio = () => {
        const queimadasPorMunicipio = {};

        data.forEach(queimada => {
            const municipio = queimada.municipio;
            if (!queimadasPorMunicipio[municipio]) {
                queimadasPorMunicipio[municipio] = 1;
            } else {
                queimadasPorMunicipio[municipio]++;
            }
        });

        return queimadasPorMunicipio;
    };

    // Obter os 5 estados com mais queimadas
    const topEstados = Object.entries(countQueimadasPorEstado())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    // Obter os 5 municípios com mais queimadas
    const topMunicipios = Object.entries(countQueimadasPorMunicipio())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    // Formatando os dados para o BarChart
    const seriesEstados = topEstados.map(([estado, queimadas]) => ({ name: estado, data: [queimadas] }));
    const seriesMunicipios = topMunicipios.map(([municipio, queimadas]) => ({ name: municipio, data: [queimadas] }));

    return (
        <div>
            <h2>Estados com Mais Queimadas</h2>
            <BarChart
                series={seriesEstados}
                height={400}
                xAxis={[{ data: topEstados.map(([estado]) => estado), scaleType: 'band' }]}
                margin={{ top: 20, bottom: 40, left: 40, right: 20 }}
            />

            <h2>Municípios com Mais Queimadas</h2>
            <BarChart
                series={seriesMunicipios}
                height={400}
                xAxis={[{ data: topMunicipios.map(([municipio]) => municipio), scaleType: 'band' }]}
                margin={{ top: 20, bottom: 40, left: 40, right: 20 }}
            />
        </div>
    );
};

export default Chart;