const fs = require('fs');
const path = require('path');

const logFolderPath = process.env.LOG_FOLDER_PATH || 'log';
const logFileName = 'log.txt';


async function logUpload(fileName) {
  try {
    const logFilePath = path.join(logFolderPath, logFileName);
    const currentDateTime = new Date();
    const formattedDateTime = currentDateTime.toISOString();
    const logMessage = `File ${fileName} uploaded at ${formattedDateTime}\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });
  } catch (error) {
    console.error('Error in logUpload:', error);
  }
}

module.exports = logUpload;