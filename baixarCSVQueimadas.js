import axios from 'axios';
import https from 'https';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import cheerio from 'cheerio';

// Função para baixar o CSV mais recente e converter para JSON
export async function downloadAndConvertCSV() {
    const url = 'https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/diario/Brasil/';
    const tmpPath = path.resolve('./public');

    try {
        const agent = new https.Agent({ rejectUnauthorized: false });
        const response = await axios.get(url, { httpsAgent: agent });
        const html = response.data;

        const latestCSVLink = getLatestCSVLink(html, url);
        if (!latestCSVLink) {
            throw new Error('Link para o arquivo CSV mais recente não encontrado.');
        }

        const downloadUrl = new URL(latestCSVLink, url).href;
        const csvFilePath = await downloadCSV(downloadUrl, tmpPath, agent);

        console.log('Arquivo CSV mais recente baixado com sucesso:', csvFilePath);

        const jsonFilePath = await convertCSVtoJSON(csvFilePath, tmpPath);
        console.log('Arquivo CSV convertido para JSON com sucesso:', jsonFilePath);
    } catch (error) {
        console.error('Erro ao baixar e converter o arquivo CSV:', error);
        throw error; // Propagar o erro para o chamador, se necessário
    }
}

function getLatestCSVLink(html, baseUrl) {
    const $ = cheerio.load(html);
    return $('a[href$=".csv"]').last().attr('href');
}

async function downloadCSV(url, tmpPath, agent) {
    const csvFilePath = path.join(tmpPath, 'latest.csv');
    const response = await axios.get(url, { responseType: 'stream', httpsAgent: agent });
    const csvStream = fs.createWriteStream(csvFilePath);
    response.data.pipe(csvStream);
    await streamFinished(csvStream);
    return csvFilePath;
}

function streamFinished(stream) {
    return new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
    });
}

async function convertCSVtoJSON(csvFilePath, tmpPath) {
    const jsonFilePath = path.join(tmpPath, 'latest.json');
    const jsonData = [];
    await new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on('data', (data) => jsonData.push(data))
            .on('end', () => {
                fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(jsonFilePath);
                    }
                });
            })
            .on('error', reject);
    });
    return jsonFilePath;
}

// Comente essa linha no ambiente de produção
// downloadAndConvertCSV();