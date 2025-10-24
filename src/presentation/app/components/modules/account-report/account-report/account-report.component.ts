import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, NgForm, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { AppConstant } from '../../../../../../common/app-constant';
import { HttpParams } from '@angular/common/http';
import { ToasterService } from '../../../../../../common/toaster-service';
import { Router } from '@angular/router';
import { AccountreportService } from '../../../../../../domain/services/account-report.service';
import { AccountReport } from '../../../../../../domain/models/accountreport.model';
@Component({
  selector: 'app-account-report',
  templateUrl: './account-report.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './account-report.component.scss'
})

export class AccountReportComponent implements OnInit {
  accountReport: AccountReport[] = [];
  yearCtrl: FormControl = new FormControl(null);
  selectedYear: number | null = null;

  constructor(
    private accountreportService: AccountreportService,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getClientList();
    
  }

  onCancel() {
    this.router.navigate(['/accountreport/dashboard']);
  }
  
 
  getClientList(): void {
    const params = new HttpParams()
      .set('isSkipPaging', true)

    this.accountreportService.getAccountreport(AppConstant.GET_Account_SEARCH, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.accountReport = response.data as AccountReport[];
        } else {
          this.accountReport = [];
        }
      }
    });
  }

  // Handler for year selection from the datepicker's year view
  chosenYearHandler(normalizedYear: Date, datepicker: MatDatepicker<Date>) {
    // create a date with the selected year and set to Jan 1
    const ctrlValue = this.yearCtrl.value ? new Date(this.yearCtrl.value) : new Date();
    ctrlValue.setFullYear(normalizedYear.getFullYear());
    ctrlValue.setMonth(0);
    ctrlValue.setDate(1);
    this.yearCtrl.setValue(ctrlValue);
    this.selectedYear = ctrlValue.getFullYear();
    datepicker.close();
    this.onYearChange(this.selectedYear);
  }

  // Called when year changes — keep minimal: set value and refresh list (customize as needed)
  onYearChange(year: any) {
    this.selectedYear = typeof year === 'number' ? year : (year && year.getFullYear ? year.getFullYear() : year);
    // If you want to reload data based on year, call a method here.
    // For now, re-fetch the client list (adjust to your actual filtering behavior).
    this.getClientList();
  }

   
 
 

   

   
}

