import * as XLSX from 'xlsx';

export const exportDailySalesToExcel = (salesData: { sales: number; date: string }[], timeRange: string) : void => {
  if (!salesData || salesData.length === 0) {
    console.log('[EXCEL] No sales data to export');
    return;
  }

  console.log('[EXCEL] Exporting sales data:', salesData);

  // Create worksheet from the sales data
  const worksheet = XLSX.utils.json_to_sheet(salesData);

  // Create workbook and add worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');

  // Generate file name with current date

  const fileName = `sales_report_per_day${timeRange}.xlsx`;

  // Export the file
  XLSX.writeFile(workbook, fileName);
};


          
