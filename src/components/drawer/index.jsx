import React from 'react';
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
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
    const [open, setOpen] = React.useState(false);

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

        // Título
        const titulo = 'Relatório de Queimadas';
        const larguraTitulo = doc.getStringUnitWidth(titulo) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const centroPagina = doc.internal.pageSize.width / 2;
        const posicaoTitulo = centroPagina - larguraTitulo / 2;

        doc.setFontSize(16);
        doc.text(titulo, posicaoTitulo, y);
        y += 15;

        // Texto sobre queimadas
        const textoQueimadas = 
        "As queimadas representam um dos maiores desafios ambientais da atualidade, com consequências " +
        "severas para a biodiversidade, o equilíbrio dos ecossistemas e a qualidade de vida. Ao destruírem " +
        "habitats naturais, elas ameaçam inúmeras espécies e provocam a fragmentação de ecossistemas " + 
        "inteiros, dificultando a recuperação da flora e fauna locais. Além disso, as queimadas são " +
        "responsáveis por liberar grandes quantidades de gases de efeito estufa, como o dióxido de carbono " +
        "e o metano, agravando o aquecimento global e contribuindo diretamente para as mudanças " +
        "climáticas. O aumento da poluição atmosférica causado por esse fenômeno também gera impactos " +
        "na saúde humana, especialmente em comunidades próximas às áreas afetadas. Este relatório busca " +
        "oferecer uma visão geral sobre a atual situação dos focos de queimadas, destacando os principais " +
        "pontos de concentração, bem como o impacto ambiental associado.";

        // Definir espaçamento e justificar
        const lineHeight = 1.5;
        doc.setFontSize(12);
        doc.setLineHeightFactor(lineHeight); // Definindo o espaçamento de 1,5
        doc.text(textoQueimadas, 10, y, { maxWidth: 180, align: 'justify' });
        y += 30; // Ajustar o espaçamento após o texto

        // Contagem total de focos de queimadas
        const totalFocos = data.length;

        // Estado com mais focos
        const focosPorEstado = data.reduce((acc, queimada) => {
            acc[queimada.estado] = (acc[queimada.estado] || 0) + 1;
            return acc;
        }, {});

        const estadoComMaisFocos = Object.keys(focosPorEstado).reduce((a, b) => focosPorEstado[a] > focosPorEstado[b] ? a : b);

        // Município com mais focos
        const focosPorMunicipio = data.reduce((acc, queimada) => {
            acc[queimada.municipio] = (acc[queimada.municipio] || 0) + 1;
            return acc;
        }, {});

        const municipioComMaisFocos = Object.keys(focosPorMunicipio).reduce((a, b) => focosPorMunicipio[a] > focosPorMunicipio[b] ? a : b);

        // Criar tabela
        const tableColumn = ["Descrição", "Informação"];
        const tableRows = [
            ["Total de focos", totalFocos.toString()],
            ["Estado com mais focos", `${estadoComMaisFocos} (${focosPorEstado[estadoComMaisFocos]} focos)`],
            ["Município com mais focos", `${municipioComMaisFocos} (${focosPorMunicipio[municipioComMaisFocos]} focos)`]
        ];

        // Adicionar tabela ao PDF
        y += 10; // Ajustar o espaçamento antes da tabela
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: y,
            styles: { halign: 'center' }, // Centraliza o texto da tabela
            theme: 'grid', // Adiciona bordas ao redor da tabela
        });

        // Data do relatório
        const dataRelatorio = new Date().toLocaleDateString();
        doc.text(`Data do relatório: ${dataRelatorio}`, 10, doc.autoTable.previous.finalY + 10);

        // Gerar URL Blob e abrir em nova aba
        const pdfUrl = doc.output('bloburl');
        window.open(pdfUrl, '_blank'); // Abre em nova aba
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
                        <ListItemButton component={Link} to="/">
                            <ListItemIcon>
                                <HomeOutlinedIcon />
                            </ListItemIcon>
                            <Typography variant="body1" sx={{ marginLeft: -2 }}>
                                Início
                            </Typography>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={downloadPDF}>
                            <ListItemIcon>
                                <FileDownloadIcon />
                            </ListItemIcon>
                            <Typography variant="body1" sx={{ marginLeft: -2 }}>
                                Relatório
                            </Typography>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="dashboard">
                            <ListItemIcon>
                                <BarChartOutlinedIcon />
                            </ListItemIcon>
                            <Typography variant="body1" sx={{ marginLeft: -2 }}>
                                Dashboard
                            </Typography>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
            </Main>
        </Box>
    );
}
