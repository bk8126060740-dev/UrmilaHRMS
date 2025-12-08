import { Injectable } from "@angular/core";
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: "root",
})
export class ExportXLSFileService {
   
  exportAsExcelFile(data: any[], fileName: string): void {
    debugger
     const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, fileName);
  XLSX.writeFile(wb, fileName + '.xlsx');
  }
}


