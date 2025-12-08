import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppConstant } from '../../../../../../common/app-constant';
import { PfChallanService } from '../../../../../../domain/services/pfChallan.service';
import { FormControl } from '@angular/forms';
 import { ExportXLSFileService } from '../../../../../../domain/services/ui-service/ExportXLSFile.service';


@Component({
  selector: 'app-missing-contribution-report',
  templateUrl: './missing-contribution-report.component.html',
  styleUrl: './missing-contribution-report.component.scss'
})
export class MissingContributionReportComponent {

  EpfContributionReportlist: any[] = [];
  totalCount: number = 0;

  fromDateCtrl = new FormControl(new Date());
  fromDate: Date = new Date();

  pageNumber: number = 1;
  recordCount: number = 10;
  nextDisabled: boolean = false;

  constructor(private pfChallanService: PfChallanService, private exportService: ExportXLSFileService
  ) { }

  ngOnInit(): void {
    this.getMissingEFPOList(this.fromDate);
  }
onDateChange(): void {
  const selectedDate = this.fromDateCtrl.value;

  if (selectedDate) {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);

    this.fromDate = date;
    this.pageNumber = 1;

    this.getMissingEFPOList(this.fromDate);
  }
}

 
  getMissingEFPOList(date: Date) {
    const params = new HttpParams()
      .set('PageNumber', this.pageNumber)
      .set('PageSize', this.recordCount)
      .set('FilterBy', date.toISOString());

    this.pfChallanService.getPaginationData(AppConstant.Get_MissingEFPO, params)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.EpfContributionReportlist = response.data.list;
            this.totalCount = response.data.totalCount;

            this.nextDisabled = (this.pageNumber * this.recordCount) >= this.totalCount;
          }
        }
      });
  }
 export() {
  this.exportService.exportAsExcelFile(this.EpfContributionReportlist, 'MissingEFPO');
}

 
  onTotalRecoredChange(event: any): void {
    this.recordCount = event;
    this.pageNumber = 1;
    this.getMissingEFPOList(this.fromDate);
  }

  onPageChange(page: number): void {
    if (page < 1) return;
    if (page > 1 && this.nextDisabled) return;

    this.pageNumber = page;
    this.getMissingEFPOList(this.fromDate);
  }

}
