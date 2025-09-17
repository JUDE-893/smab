import chromium from "@sparticuz/chromium-min";
import { Browser } from "puppeteer";
import { Browser as CoreBrowser } from "puppeteer-core";

export async function GET(req: Request) {
  const reqUrl = new URL(req.url);
  const pageUrl = reqUrl.searchParams.get("url");
  const fileName = reqUrl.searchParams.get("fileName");
  const filePageWidth = reqUrl.searchParams.get("filePageWidth");
  const filePageHeight = reqUrl.searchParams.get("filePageHeight");

  if (!pageUrl) {
    return new Response(JSON.stringify({ error: "No URL provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let browser: Browser | CoreBrowser;

  const puppeteer = await import("puppeteer");
  browser = await puppeteer.launch({
    headless: "new",
    executablePath: process.env.BROWSER_PATH,
  });
  
  const page = await browser.newPage();
  await page.goto(pageUrl, { waitUntil: "networkidle0" });

  // Wait for animations/data to finish
  await new Promise(resolve => setTimeout(resolve, 0));


  const pdfBuffer = await page.pdf({
    width: `${filePageWidth || 210}mm`,
    height: `${filePageHeight || 297}mm`,
    printBackground: true,
  });

  await browser.close();

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName || 'page'}.pdf"`,
    },
  });
}
