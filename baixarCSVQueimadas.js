import axios from 'axios';
import https from 'https';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import cron from 'node-cron';
import cheerio from 'cheerio';

// Função para baixar o CSV mais recente e converter para JSON
async function downloadAndConvertCSV() {
    // URL da página onde o arquivo CSV mais recente está localizado
    const url = 'https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/diario/Brasil/';
    // Caminho onde o arquivo CSV será salvo
    const downloadPath = './public';

    try {
        const agent = new https.Agent({ rejectUnauthorized: false });
        const response = await axios.get(url, { httpsAgent: agent });
        const html = response.data;

        // Encontra o link do último arquivo CSV na página
        const $ = cheerio.load(html);
        const latestCSVLink = $('a[href$=".csv"]').last().attr('href');
        const downloadUrl = new URL(latestCSVLink, url).href;

        // Faz o download do arquivo CSV
        const csvResponse = await axios.get(downloadUrl, { responseType: 'stream', httpsAgent: agent });
        const csvFilePath = path.join(downloadPath, 'latest.csv');
        const csvStream = fs.createWriteStream(csvFilePath);
        csvResponse.data.pipe(csvStream);

        // Aguarda o término do download
        await new Promise((resolve, reject) => {
            csvStream.on('finish', resolve);
            csvStream.on('error', reject);
        });

        console.log('Arquivo CSV mais recente baixado com sucesso:', csvFilePath);

        // Converte o arquivo CSV para JSON
        const jsonFilePath = path.join(downloadPath, 'latest.json');
        const jsonData = [];
        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on('data', (data) => jsonData.push(data))
            .on('end', () => {
                fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
                    if (err) {
                        console.error('Erro ao converter CSV para JSON:', err);
                    } else {
                        console.log('Arquivo CSV convertido para JSON com sucesso:', jsonFilePath);
                    }
                });
            });
    } catch (error) {
        console.error('Erro ao baixar o arquivo CSV mais recente:', error);
    }
}

// Agenda a execução do script todos os dias às 18h
cron.schedule('00 18 * * *', () => {
    console.log('Executando script para baixar e converter CSV...');
    downloadAndConvertCSV();
});