import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    try {
        // Caminho para o arquivo latest.json na pasta temporária
        const filePath = path.join('/tmp', 'latest.json');

        // Lê o arquivo latest.json
        const data = fs.readFileSync(filePath);

        // Define o cabeçalho Content-Type como application/json
        res.setHeader('Content-Type', 'application/json');

        // Envia o conteúdo do arquivo como resposta
        res.status(200).send(data);
    } catch (error) {
        console.error('Erro ao ler o arquivo latest.json:', error);
        res.status(500).end('Internal Server Error');
    }
}