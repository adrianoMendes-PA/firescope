import downloadAndConvertCSV from '../baixarCSVQueimadas';

async function main() {
    try {
        await downloadAndConvertCSV();
        console.log("CSV downloaded and converted successfully!");
        res.status(200).end('CSV downloaded and converted successfully!');
    } catch (error) {
        console.error('Error downloading or converting CSV:', error);
        res.status(500).end('Internal Server Error');
    }
}

// Chama a função principal
main();