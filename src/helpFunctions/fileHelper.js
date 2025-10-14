const fs = require('fs');


function readFile(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
    const data = fs.readFileSync(filePath, 'utf8');
    try {
        return JSON.parse(data || '[]');
    } catch (error) {
        throw new Error(`Error parsing JSON from file: ${filePath}`);
    }
}


function writeFile(filePath, data) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf8');
}


module.exports = { readFile, writeFile };