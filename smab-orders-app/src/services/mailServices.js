import { google } from "googleapis";
import fs from "fs/promises";
import logger from "../utils/logger.js";
import { authorize } from "./googleService.js";
import * as cheerio from "cheerio";
// import { printPDF, DEFAULT_PRINTER } from "./printService";
// import { generatePdf } from "./pdfService";




// Main email watching function
export const watchEmails = async (auth) => {
    let gmail = google.gmail({ version: "v1", auth });
    process.stdout.setEncoding("utf8");
    
    // Ensure orders directory exists
    await fs.mkdir("./orders", { recursive: true }).catch(() => {});
    
    // Token refresh mechanism
    let lastTokenRefresh = Date.now();
    const refreshTokenIfNeeded = async () => {
      const TWELVE_HOURS = 12 * 60 * 60 * 1000;
      if (Date.now() - lastTokenRefresh > TWELVE_HOURS) {
        logger.info("Refreshing authentication token...");
        try {
          auth = await authorize();
          gmail = google.gmail({ version: "v1", auth });
          lastTokenRefresh = Date.now();
          logger.info("Authentication token refreshed successfully");
        } catch (error) {
          logger.error("Failed to refresh token:", error.message);
        }
      }
    };
  
    // In the poll function:
    const poll = async () => {
      try {
        // Refresh token if needed
        await refreshTokenIfNeeded();
        
        // Ping to verify connection
        logger.info(`Polling for new emails at ${new Date().toISOString()}`);
        
        const res = await gmail.users.messages.list({
          userId: "me",
          labelIds: ["INBOX"],
          q: "is:unread",
        });
  
        const messages = res.data.messages || [];
        logger.info(`Found ${messages.length || 0} unread messages`);
        
        // Process emails sequentially with delay between them
        for (const message of messages) {
          await processEmail(gmail, message);
  
          // Add delay between processing emails
          logger.info("Adding delay between email processing");
          await new Promise((resolve) => setTimeout(resolve, 10000));
        }
      } catch (error) {
        logger.error("Error polling messages:", error.message);
        // Try to re-authenticate on error
        if (error.message.includes("auth") || error.message.includes("token")) {
          try {
            logger.info("Attempting re-authentication after error...");
            auth = await authorize();
            gmail = google.gmail({ version: "v1", auth });
            lastTokenRefresh = Date.now();
          } catch (authError) {
            logger.error("Re-authentication failed:", authError.message);
          }
        }
      }
  
      // Schedule next poll
      setTimeout(poll, POLL_INTERVAL);
    };
  
    // Start polling
    poll();
    
    // Cette promesse ne se résout jamais, ce qui garde watchEmails actif en permanence
    return new Promise(() => {
      logger.info("Email monitoring active and continuous...");
    });
  };

// Email processing pipeline
const processEmail = async (gmail, message) => {
    try {
      logger.info(`Starting to process message ID: ${message.id}`);
  
      const email = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
        format: "full",
      });
  
      const headers = email.data.payload.headers;
      const getHeader = (name) =>
        decodeHeader(headers.find((h) => h.name === name)?.value || `No ${name}`);
  
      const subject = getHeader("Subject");
      const from = getHeader("From");
  
      logger.info(`Processing email - Subject: "${subject}", From: ${from}`);
  
      const { content: emailContent } = getEmailBody(email.data.payload);
      const orderInfo = extractOrderInfo(emailContent);
  
      if (!orderInfo || !orderInfo.orderNumber) {
        logger.warn(`No valid order information found in email ${message.id}`);
        return;
      }
  
      logger.info(
        `Extracted Order #${orderInfo.orderNumber} with ${orderInfo.products.length} products`
      );
  
      const pdfPath = await generatePdf(orderInfo);
      if (!pdfPath) {
        logger.error(
          `Failed to generate PDF for order #${orderInfo.orderNumber}`
        );
        return;
      }
  
      // Log memory usage before printing - critical for PM2-managed apps
      const memoryUsage = process.memoryUsage();
      logger.info(
        `Memory usage before printing: RSS: ${Math.round(
          memoryUsage.rss / 1024 / 1024
        )}MB, HeapUsed: ${Math.round(
          memoryUsage.heapUsed / 1024 / 1024
        )}MB/${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
      );
  
      // Print with longer timeout for PM2 environment
      const printResult = await printPDF(pdfPath, DEFAULT_PRINTER);
  
      if (!printResult) {
        logger.error(`Printing failed for ${pdfPath} - Email will remain unread`);
        return;
      }
  
      // Add delay between printing and marking as read
      await new Promise((resolve) => setTimeout(resolve, 3000));
  
      const readMarkResult = await markAsRead(gmail, message.id);
      if (!readMarkResult) {
        logger.warn(
          `Failed to mark message ${message.id} as read despite successful processing`
        );
      }
  
      logger.info(`Successfully completed processing email ${message.id}`);
    } catch (error) {
      logger.error(
        `Error processing email ${message?.id || "unknown"}: ${error.message}`
      );
      logger.error(`Error stack: ${error.stack}`);
    }
  };

// Pure functions for data transformation
const decodeBody = (body) => {
    if (!body) return "";
  
    if (body.data) {
      let base64 = body.data.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) {
        base64 += "=";
      }
      return Buffer.from(base64, "base64").toString("utf8");
    }
  
    return body;
  };
  
const decodeHeader = (header) => {
if (!header?.includes("=?UTF-8?")) return header;

return header.replace(/=\?UTF-8\?.\?(.*?)\?=/g, (match, p1) => {
    try {
    return decodeURIComponent(escape(Buffer.from(p1, "base64").toString()));
    } catch (e) {
    return p1;
    }
});
};
  
// Email content processing functions
const getEmailBody = (payload) => {
const extractBodyFromPart = (part) => ({
    content: decodeBody(part.body),
    type: part.mimeType,
});

const findPartByMimeType = (parts, mimeType) =>
    parts.find((part) => part.mimeType === mimeType);

if (payload.parts) {
    const htmlPart = findPartByMimeType(payload.parts, "text/html");
    if (htmlPart) return extractBodyFromPart(htmlPart);

    const textPart = findPartByMimeType(payload.parts, "text/plain");
    if (textPart) return extractBodyFromPart(textPart);

    // Recursively check nested parts
    for (const part of payload.parts) {
    if (part.parts) {
        const nestedBody = getEmailBody(part);
        if (nestedBody.content !== "No readable content found")
        return nestedBody;
    }
    }
}

if (payload.body) return extractBodyFromPart(payload);

return {
    content: "No readable content found",
    type: "plain",
};
};

// Order processing functions
const extractOrderInfo = (html) => {
    const $ = cheerio.load(html);
    const infoText = $("body > div > div").text();
  
    // Match the exact values using regex
    const orderNumberMatch = infoText.match(/رقم الطلب:\s*(\d+)/);
    const orderDateMatch = infoText.match(/تاريخ الطلب:\s*([0-9/]+)/);
    const paymentMethodMatch = infoText.match(/طريقة الدفع:\s*([^\n]+)/);
  
    const orderNumber = orderNumberMatch ? orderNumberMatch[1].trim() : "";
    const orderDate = orderDateMatch ? orderDateMatch[1].trim() : "";
    const paymentMethod = paymentMethodMatch ? paymentMethodMatch[1].trim() : "";
  
    // Extract products
    const tableRows = $("table tr");
    const products = [];
  
    tableRows.each((index, row) => {
      if (index === 0) return; // skip header
  
      const columns = $(row).find("td");
  
      if (columns.length >= 4) {
        products.push({
          name: $(columns[0]).text().trim(),
          quantity: $(columns[1]).text().trim(),
          barcode: $(columns[2]).text().trim(),
          warehouse: $(columns[3]).text().trim(),
        });
      }
    });
  
    return {
      orderNumber,
      orderDate,
      paymentMethod,
      products,
    };
  };

// Gmail API interaction functions
const markAsRead = async (gmail, messageId) => {
    try {
      await gmail.users.messages.modify({
        userId: "me",
        id: messageId,
        requestBody: {
          removeLabelIds: ["UNREAD"],
        },
      });
      logger.info("Message marked as READ " + messageId);
      return true;
    } catch (error) {
      logger.error("Error marking message as READ:", error.message);
      return false;
    }
  };

