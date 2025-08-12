import logger from "../utils/logger.js";
import pkg from 'pdf-to-printer';
const { getPrinters, print } = pkg;
import path from "path";
import fs from "fs/promises";
import ejs from "ejs";

// Printer utility functions
export const listPrinters = async () => {
    try {
      const printers = await getPrinters();
      printers.forEach((printer) =>
        logger.info("Available Printers: " + printer.name)
      );
      return printers;
    } catch (error) {
      logger.error("Error fetching printers:", error.message);
      return [];
    }
  };

// Improved printPDF function with retry mechanism
export const printPDF = async (filePath, printerName) => {
    try {
      // Check if we can access the file (important for PM2 with different working directory)
      try {
        await fs.access(filePath);
      } catch (err) {
        logger.error(`Cannot access file ${filePath}: ${err.message}`);
        // Try with absolute path
        const absolutePath = path.resolve(filePath);
        logger.info(`Trying with absolute path: ${absolutePath}`);
        filePath = absolutePath;
      }
  
      // Print with longer timeout for PM2
      logger.info(`Sending ${filePath} to printer ${printerName}`);
      await print(filePath, { printer: printerName });
      logger.info(`Document ${filePath} sent to printer ${printerName}`);
  
      // Add a small delay to let the printer process the job
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return true;
    } catch (error) {
      logger.error(`Error printing document ${filePath}:`, error.message);
      logger.error(`Printer error details: ${JSON.stringify(error)}`);
  
      // Retry mechanism with increased delay for PM2
      try {
        logger.info(`Retrying print for ${filePath} after 10 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 10000));
        await print(filePath, { printer: printerName });
        logger.info(
          `Retry successful: Document ${filePath} sent to printer ${printerName}`
        );
        return true;
      } catch (retryError) {
        logger.error(`Retry failed for ${filePath}:`, retryError.message);
        return false;
      }
    }
  };

export const generatePdf = async (orderInfo) => {
    const { orderNumber, orderDate, salesAgent, products } = orderInfo;
    const formattedDate = orderDate.replace(/\//g, "-");
    const pdfFileName = `${orderNumber}_${formattedDate}.pdf`;
    const pdfPath = `./orders/${pdfFileName}`;
  
    // Ensure absolute path for PM2
    const absolutePdfPath = path.resolve(pdfPath);
  
    // Read logo file and convert to base64
    let logoBase64 = "";
    try {
      const logoPath = path.join(__dirname, "public", "smab.png");
      const logoBuffer = await fs.readFile(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    } catch (error) {
      logger.warn("Could not load logo image:", error.message);
      console.log(error);
      
      logoBase64 = "data:image/png;base64,";
    }
  
    const templatePath = path.join(__dirname, "src/views", "index.ejs");
    logger.info(`Using template: ${templatePath}`);
  
    const html = await ejs.renderFile(templatePath, {
      orderNumber,
      orderDate,
      salesAgent,
      products,
      logoBase64,
    });
  
    logger.info(`Launching browser for PDF generation: ${pdfFileName}`);
    const browser = await puppeteer.launch({
      executablePath: BROWSER_PATH,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
      ],
      timeout: 60000, // 60 seconds
    });
  
    try {
      const page = await browser.newPage();
  
      // Set longer navigation timeout for PM2 environment
      page.setDefaultNavigationTimeout(60000);
  
      logger.info(`Setting HTML content for order #${orderNumber}`);
      await page.setContent(html, {
        waitUntil: "networkidle0",
        timeout: 60000,
      });
  
      logger.info(
        `Generating PDF for order #${orderNumber} at path: ${absolutePdfPath}`
      );
      await page.pdf({
        path: absolutePdfPath,
        format: "A4",
        printBackground: true,
        margin: {
          top: "20px",
          right: "20px",
          bottom: "20px",
          left: "20px",
        },
        timeout: 60000,
      });
  
      logger.info("PDF generated successfully: " + pdfFileName);
      return absolutePdfPath;
    } catch (error) {
      logger.error(
        `Error generating PDF for order #${orderNumber}: ${error.message}`
      );
      logger.error(`Error stack: ${error.stack}`);
      return null;
    } finally {
      try {
        await browser.close();
        logger.info(`Browser closed after PDF generation for ${pdfFileName}`);
      } catch (closeError) {
        logger.warn(`Error closing browser: ${closeError.message}`);
      }
    }
  };

  const order = {
    _id: "689b066f85b0408655dd48aa",
    orderNumber: "1439",
    orderDate: "2025/04/07",
    paymentMethod: "",
    products: [
      {
        name: "Soudeuse a tapis 900 verticale",
        quantity: 4,
        barcode: "000.000.115",
        warehouse: "MAG",
        _id: "689b07d429194c0d5eb3abab"
      },
      {
        name: "Ensacheuse de thé automatique avec Tag",
        quantity: 1,
        barcode: "000.000.925",
        warehouse: "MAG",
        _id: "689b07d429194c0d5eb3abac"
      },
      {
        name: "Doseuse et boucheuse de pots 100-1000ml",
        quantity: 1,
        barcode: "000.000.1326",
        warehouse: "MAG",
        _id: "689b07d429194c0d5eb3abad"
      }
    ],
    updatedAt: new Date("2025-08-12T09:22:28.963Z"),
    salesAgent: "Sales Agent3",
    isConfirmed: false,
    __v: 0
  };
let g = generatePdf(order)
console.log("[GENERATEPDF]", g);
