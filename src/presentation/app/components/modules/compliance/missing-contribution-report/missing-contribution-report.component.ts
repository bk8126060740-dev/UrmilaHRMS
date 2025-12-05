import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppConstant } from '../../../../../../common/app-constant';
import { PfChallanService } from '../../../../../../domain/services/pfChallan.service';

@Component({
  selector: 'app-missing-contribution-report',
  templateUrl: './missing-contribution-report.component.html',
  styleUrl: './missing-contribution-report.component.scss'
})
export class MissingContributionReportComponent {

  EpfContributionReportlist: any[] = [];
  totalCount: number = 0;

  pageNumber: number = 1;
  recordCount: number = 10;

  nextDisabled: boolean = false;

  constructor(private pfChallanService: PfChallanService) { }

  ngOnInit(): void {
    this.getMissingEFPOList();
  }

  getMissingEFPOList() {
    const params = new HttpParams()
      .set('PageNumber', this.pageNumber)
      .set('PageSize', this.recordCount)
      .set('FilterBy', new Date().toISOString());

    this.pfChallanService
      .getPaginationData(AppConstant.Get_MissingEFPO, params)
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

  onTotalRecoredChange(event: any): void {
    this.recordCount = event;
    this.pageNumber = 1;
    this.getMissingEFPOList();
  }

  onPageChange(page: number): void {
    if (page < 1) return;
    if (page > 1 && this.nextDisabled) return;

    this.pageNumber = page;
    this.getMissingEFPOList();
  }
}
