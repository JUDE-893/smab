import { IconChartBar } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { log } from "console";

export function GenerateReportButton({ reportMetadate }) {
  const handleClick = async () => {
    let { fileName, filePageHeight, filePageWidth } = reportMetadate;

    console.log("fileName, filePageHeight, filePageWidth", fileName, filePageHeight, filePageWidth);
    

    // Create URL with proper encoding
    const targetUrl = new URL(window.location.href);
    targetUrl.searchParams.set('generatePDFMode', 'true');

    const params = new URLSearchParams();
    params.append('url', targetUrl.toString());
    if (fileName?.length > 0) params.append('fileName', fileName);
    if (filePageWidth > 0) params.append('filePageWidth', filePageWidth);
    if (filePageHeight > 0) params.append('filePageHeight', filePageHeight);

    try {
      console.log("ocess.env.NEXT_PUBLIC_GENERATE_PDF_REPORT_API",process.env.NEXT_PUBLIC_GENERATE_PDF_REPORT_API);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GENERATE_PDF_REPORT_API}?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName || 'page.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleClick}>
      <IconChartBar />
      <span id="generate-report" className="hidden lg:inline">Generate Report</span>
    </Button>
  );
}
