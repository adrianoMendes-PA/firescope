import downloadAndConvertCSV from './baixarCSVQueimadas.js';

async function main() {
    try {
        await downloadAndConvertCSV();
        console.log("CSV downloaded and converted successfully!");
    } catch (error) {
        console.error('Error downloading or converting CSV:', error);
    }
}

// Chama a função principal
main();
