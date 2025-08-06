import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFile = path.join(__dirname, '../../logs/app.log');

const info = (msg) => {
  const message = `[INFO] ${new Date().toISOString()} - ${msg}\n`;
  fs.appendFileSync(logFile, message);
  console.log(message.trim());
};

const error = (msg) => {
  const message = `[ERROR] ${new Date().toISOString()} - ${msg}\n`;
  fs.appendFileSync(logFile, message);
  console.error(message.trim());
};

const warn = (msg) => {
  const message = `[WARNING] ${new Date().toISOString()} - ${msg}\n`;
  fs.appendFileSync(logFile, message);
  console.error(message.trim());
};

export default { info, error, warn };
