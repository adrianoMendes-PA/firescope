import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Container from '@mui/material/Container';

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

    // const countQueimadasPorMunicipio = () => {
    //     const queimadasPorMunicipio = {};

    //     data.forEach(queimada => {
    //         const municipio = queimada.municipio;
    //         if (!queimadasPorMunicipio[municipio]) {
    //             queimadasPorMunicipio[municipio] = 1;
    //         } else {
    //             queimadasPorMunicipio[municipio]++;
    //         }
    //     });

    //     return queimadasPorMunicipio;
    // };

    const topEstados = Object.entries(countQueimadasPorEstado())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    // const topMunicipios = Object.entries(countQueimadasPorMunicipio())
    //     .sort(([, a], [, b]) => b - a)
    //     .slice(0, 5);

    const seriesEstados = topEstados.map(([estado, queimadas]) => ({ id: estado, value: queimadas, label: estado }));
    //const seriesMunicipios = topMunicipios.map(([municipio, queimadas]) => ({ id: municipio, value: queimadas, label: municipio }));

    return (
        <Container style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <h1>Estados com mais queimadas</h1>
                <PieChart
                    series={[{ data: seriesEstados }]}
                    width={700}
                    height={400}
                />
            </div>
        </Container>
    );
};

export default Chart;