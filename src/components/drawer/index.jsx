import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import jsPDF from 'jspdf';

const drawerWidth = 170;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const PersistentDrawerLeft = () => {
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    const downloadPDF = async () => {
        try {
            const response = await fetch('/latest.json');
            const data = await response.json();

            const doc = new jsPDF();

            let y = 10;
            let pageIndex = 1;

            // Título
            const titulo = 'Relatório de Queimadas';
            const larguraTitulo = doc.getStringUnitWidth(titulo) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            const centroPagina = doc.internal.pageSize.width / 2;
            const posicaoTitulo = centroPagina - larguraTitulo / 2;

            doc.setFontSize(16);
            doc.text(titulo, posicaoTitulo, y);
            doc.setFontSize(12);
            y += 10;

            data.forEach((queimada, index) => {
                const dataHora = new Date(queimada.data_hora_gmt);
                const dataFormatada = formatDate(dataHora);
                const horaFormatada = formatTime(dataHora);

                // Detalhes da queimada
                const detalhes = [
                    `Cidade: ${queimada.municipio}`,
                    `Estado: ${queimada.estado}`,
                    `Latitude: ${queimada.lat}`,
                    `Longitude: ${queimada.lon}`,
                    `Data e hora: ${dataFormatada} às ${horaFormatada}`,
                    `Bioma: ${queimada.bioma}`
                    // Adicionar mais informações conforme necessário
                ];

                const linhaAltura = 10; // Altura estimada de uma linha de texto
                const alturaTotalDetalhes = detalhes.length * linhaAltura;

                if (y + alturaTotalDetalhes > doc.internal.pageSize.height - 10) {
                    doc.addPage(); // Adiciona uma nova página se não houver espaço suficiente
                    pageIndex++;
                    y = 10; // Reinicia a posição y na nova página
                }

                detalhes.forEach((detalhe, i) => {
                    doc.text(detalhe, 10, y + i * linhaAltura);
                });

                y += alturaTotalDetalhes + 10; // Aumenta a posição y para a próxima seção
            });

            doc.save(`Relatório de Queimadas ${pageIndex}.pdf`);
        } catch (error) {
            console.error('Erro ao obter os dados:', error);
        }
    };


    // Função para formatar a data
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Função para formatar a hora
    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };



    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} style={{ backgroundColor: "#060d1d" }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        FireScope
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <HomeOutlinedIcon />
                                </ListItemIcon>
                                <Typography sx={{ marginLeft: -1 }}>Início</Typography>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link style={{ textDecoration: 'none', color: 'inherit' }}>
                            <ListItemButton onClick={downloadPDF}>
                                <ListItemIcon>
                                    <FileDownloadIcon />
                                </ListItemIcon>
                                <Typography sx={{ marginLeft: -1 }}>Download</Typography>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link to="chart" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <BarChartOutlinedIcon />
                                </ListItemIcon>
                                <Typography sx={{ marginLeft: -1 }}>Gráfico</Typography>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
            </Main>
        </Box>
    );
};

export default PersistentDrawerLeft;
