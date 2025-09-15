import * as XLSX from 'xlsx';


export const exportArrayToExcel = (data: any[], timeRange: string, fileName: string ): void => {

  console.log('[EXCEL]', data);

  if (!data) return;

  
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
  XLSX.writeFile(workbook, `${fileName}-${timeRange}.xlsx`);
};
