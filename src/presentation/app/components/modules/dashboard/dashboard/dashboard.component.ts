import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { EmployeeAttendanceService } from '../../../../../../domain/services/employeeattendance.service';
import { ByDateAttendance, EmployeeData } from '../../../../../../domain/models/attendance.model';
import { AppConstant } from '../../../../../../common/app-constant';
import { HttpParams } from '@angular/common/http';
import { LocalStorageService } from '../../../../../../common/local-storage.service';
import { ToasterService } from '../../../../../../common/toaster-service';
import * as Highcharts from 'highcharts';
import { ClientList } from '../../../../../../domain/models/paymentreciveable.model';
import { PaymentReciveableService } from '../../../../../../domain/services/payment-Reciveable.service';
import { ClientListModel } from '../../../../../../domain/models/client.model';
import { DashboardChartModel, DashboardPayrollModel } from '../../../../../../domain/models/dashboard-chart.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {

  Highcharts: typeof Highcharts = Highcharts;
  attendanceChartOptions: Highcharts.Options = {};
  payrollChartOptions: Highcharts.Options = {};
  salarySheetChartOptions: Highcharts.Options = {};
  pIInvoiceChartOptions: Highcharts.Options = {};
  gstInvoiceChartOptions: Highcharts.Options = {};
  utrSheetChartOptions: Highcharts.Options = {};

  attedanceData: DashboardChartModel[] = [];
  payrollData: DashboardPayrollModel[] = [];
  employeeData: EmployeeData = new EmployeeData();
  byDateAttendance: ByDateAttendance[] = [];
  currentDateTime: string = '';
  intervalId: any;
  greeting: string = '';
  asName: string = "";
  isCheckIn: boolean = false;
  clientList: ClientListModel[] = [];
  selectedClientId: any[] = [];
  monthList = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' }
  ];
  yearList: number[] = [];
  selectedMonth: number | null = 5;
  selectedYear: number | null = 2025;
  updateFlag = false;
  isHo: boolean = false;
  constructor(
    private employeeAttendanceService: EmployeeAttendanceService,
    private localStorageService: LocalStorageService,
    private toasterService: ToasterService,
    private paymentReciveableService: PaymentReciveableService
  ) {
    this.getEmployeeId();
    const storedCheckInStatus = this.localStorageService.getItem('isCheckIn');
    this.isCheckIn = storedCheckInStatus === 'true';
  }

  ngOnInit() {
    this.isHo = this.localStorageService.getItem('isHo') === 'true';
    if (this.isHo) {
      this.populateYearList();
      this.getClientList();
      this.getAttedanceData();
      this.updateDateTime();
      this.intervalId = setInterval(() => {
        this.updateDateTime();
      }, 1000);
      this.getPayrollData();
    }
  }

  onClientChange() {
    this.updateAllCharts();
    this.updateAttendanceChart();
  }

  getMatrixData() {
    this.getAttedanceData();
    this.getPayrollData();
  }

  getPayrollData() {
    let obj = {
      "month": this.selectedMonth,
      "year": this.selectedYear,
      "clientIds": this.selectedClientId
    }
    this.paymentReciveableService.postPaymentReciveable<DashboardPayrollModel[]>(AppConstant.GET_CLIENT_PAYROLL_COUNTS, obj).subscribe({
      next: (response) => {
        if (response.success) {
          this.payrollData = response.data;

          this.updateAllCharts();
        }
      }
    })
  }

  getAttedanceData(): void {
    let obj = {
      "month": this.selectedMonth,
      "year": this.selectedYear,
      "clientIds": this.selectedClientId
    }
    this.paymentReciveableService.postPaymentReciveable<DashboardChartModel[]>(AppConstant.GET_CLIENT_ATTENDANCE_COUNTS, obj).subscribe({
      next: (response) => {
        if (response.success) {
          this.attedanceData = response.data;
          this.updateAttendanceChart();
        }
      }
    })
  }

  getClientList(): void {
    const params = new HttpParams()
      .set('isSkipPaging', true)
      .set('searchTerm', '');

    this.paymentReciveableService.getPaymentReciveable<ClientListModel[]>(AppConstant.GET_CLIENT_SEARCH, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.clientList = response.data;
        } else {
          this.clientList = [];
        }
      }
    });
  }

  updateDateTime(): void {
    const now = new Date();
    this.currentDateTime = now.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(',', '');
    this.setGreeting(now.getHours());
  }

  setGreeting(hours: number): void {
    if (hours < 12) {
      this.greeting = 'Good Morning';
    } else if (hours < 18) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
  async getEmployeeId() {
    this.employeeAttendanceService.getEmployeeAttendanceUpload<EmployeeData>(AppConstant.GET_EMPLOYEE_ID).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.employeeData = response.data;
          this.asName = this.employeeData.fullName;
          this.asName = this.asName.split(' ').map(word => word[0]?.toUpperCase()).join('');
          this.getAttendanceByDate();
        } else {
        }
      }
    });
  }

  async getAttendanceByDate() {
    let params = new HttpParams()
      .set('AttendanceDate', new Date().toISOString())
      .set('EmployeeId', this.employeeData.employeeId);
    await this.employeeAttendanceService.getEmployeeAttendanceUpload<ByDateAttendance[]>(AppConstant.GET_ATTENDANCE_BY_DATE, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.byDateAttendance = response.data;
        } else {
          this.byDateAttendance = [];
        }
      }
    })
  }

  convertTo12HourFormat(time: string): string {
    if (!time) return ''; // Handle empty or undefined values

    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  async checkIn() {
    if (!this.employeeData.employeeId) {
      await this.getEmployeeId();
    }
    if (!this.employeeData.employeeId) {
      this.toasterService.errorToaster('Invalid Employee ID. Cannot check in.');
      return;
    }
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    let inTime = `${hours}:${minutes}:${seconds}`;

    let obj = {
      employeeId: this.employeeData.employeeId,
      attendanceDate: now.toISOString(),
      inTime: inTime,
      outOnDutyStatus: true
    };
    this.submitCheckInOut(obj);
  }

  async checkOut() {
    if (!this.isCheckIn) {
      this.toasterService.errorToaster('You must check in first!');
      return;
    }
    if (!this.employeeData.employeeId) {
      await this.getEmployeeId();
    }
    if (!this.employeeData.employeeId) {
      this.toasterService.errorToaster('Invalid Employee ID. Cannot check out.');
      return;
    }

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    let outTime = `${hours}:${minutes}:${seconds}`;

    let obj = {
      employeeId: this.employeeData.employeeId,
      attendanceDate: now.toISOString(),
      //inTime: this.inTime,
      outTime: outTime,
      outOnDutyStatus: true
    };
    this.submitCheckInOut(obj);
  }

  async submitCheckInOut(obj: any) {
    await this.employeeAttendanceService.postEmployeeDesignation(AppConstant.POST_CHECK_IN_OUT, obj).subscribe({
      next: (response) => {
        if (response.success) {
          this.getAttendanceByDate();
        } else {
          this.toasterService.errorToaster(response.message);
        }
      }
    })
  }

  populateYearList() {
    const startYear = 2024;
    const currentYear = new Date().getFullYear();
    this.yearList = [];
    for (let year = startYear; year <= currentYear; year++) {
      this.yearList.push(year);
    }
  }

  updateAttendanceChart() {
    let filteredData = this.attedanceData;
    if (Array.isArray(this.selectedClientId) && this.selectedClientId.length > 0) {
      filteredData = this.attedanceData.filter(client => this.selectedClientId.includes(client.clienId));
    }
    // Filter out clients with null/empty attendece or missing clientName
    filteredData = filteredData.filter(client => !!client.clientName && Array.isArray(client.attendece) && client.attendece.length > 0);



    if (!filteredData.length) {
      this.attendanceChartOptions = {
        chart: { type: 'column' },
        title: { text: 'Attendance ' },
        xAxis: { categories: [] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: { column: { stacking: 'normal', grouping: true } },
        credits: { enabled: false },
        series: []
      };
      this.updateFlag = true;
      return;
    }

    const categories: string[] = [];
    const statusMap: { [status: string]: number[] } = {};
    filteredData.forEach((client, idx) => {
      categories.push(client.clientName);
      if (Array.isArray(client.attendece)) {
        client.attendece.forEach((att: { atttendnceStatus: string; count: number }) => {
          if (!statusMap[att.atttendnceStatus]) {
            statusMap[att.atttendnceStatus] = Array(filteredData.length).fill(0);
          }
          statusMap[att.atttendnceStatus][idx] = att.count;
        });
      }
    });

    const series = Object.keys(statusMap).map(status => ({
      type: 'column',
      name: status,
      data: statusMap[status]
    }) as Highcharts.SeriesColumnOptions);

    this.attendanceChartOptions = {
      chart: { type: 'column' },
      title: { text: 'Attendance ', style: { fontSize: '16px', fontWeight: '500' } },
      xAxis: {
        categories,
        labels: {
          style: { fontSize: '12px', fontWeight: '500' },
          formatter: function () { return String(this.value).slice(0, 5); }
        }
      },
      yAxis: { title: { text: 'Count', style: { fontSize: '12px', fontWeight: '500' } } },
      plotOptions: { column: { stacking: 'normal', grouping: true } },
      credits: { enabled: false },
      tooltip: { shared: true },
      series
    };
    this.updateFlag = true;
  }

  updateAllCharts() {
    let filteredData = this.payrollData;
    if (Array.isArray(this.selectedClientId) && this.selectedClientId.length > 0) {
      filteredData = this.payrollData.filter(client => this.selectedClientId.includes(client.clienId));
    }
    filteredData = filteredData.filter(client => !!client.clientName);

    // 1. Payroll Status Chart
    const payrollCategories: string[] = [];
    const payrollStatusMap: { [status: string]: number[] } = {};
    filteredData.forEach((client, idx) => {
      payrollCategories.push(client.clientName);
      if (Array.isArray(client.payrolls)) {
        client.payrolls.forEach((pay: { status: string; count: number }) => {
          if (!payrollStatusMap[pay.status]) {
            payrollStatusMap[pay.status] = Array(filteredData.length).fill(0);
          }
          payrollStatusMap[pay.status][idx] = pay.count;
        });
      }
    });
    const payrollSeries = Object.keys(payrollStatusMap).map(status => ({
      type: 'column',
      name: status,
      data: payrollStatusMap[status]
    }) as Highcharts.SeriesColumnOptions);


    this.payrollChartOptions = {
      chart: { type: 'column' },
      title: { text: 'Payroll ', style: { fontSize: '16px', fontWeight: '500' } },
      xAxis: {
        categories: payrollCategories,
        labels: {
          style: { fontSize: '12px', fontWeight: '500' },
          formatter: function () { return String(this.value).slice(0, 5); }
        }
      },
      yAxis: { title: { text: 'Count', style: { fontSize: '12px', fontWeight: '500' } }, labels: { style: { fontSize: '12px', fontWeight: '500' } } },
      plotOptions: { column: { stacking: 'normal', grouping: true } },
      credits: { enabled: false },
      series: payrollSeries,
      tooltip: { shared: true },

    };

    // 2. Salary Sheet (Bank Sheet) Chart
    const salarySheetCategories = filteredData.map(client => client.clientName);
    const bankSheet = filteredData.map(client => client.project?.banKSheetCount ?? 0);
    const bankSheetMiss = filteredData.map(client => client.project?.banKSheetMissCount ?? 0);
    this.salarySheetChartOptions = {
      chart: { type: 'column' },
      title: { text: 'Bank Sheet ', style: { fontSize: '16px', fontWeight: '500' } },
      xAxis: {
        categories: salarySheetCategories,
        labels: {
          style: { fontSize: '12px', fontWeight: '500' },
          formatter: function () { return String(this.value).slice(0, 5); }
        }
      },
      yAxis: { title: { text: 'Count', style: { fontSize: '12px', fontWeight: '500' } }, labels: { style: { fontSize: '12px', fontWeight: '500' } } },
      plotOptions: { column: { stacking: 'normal', grouping: true } },
      credits: { enabled: false },
      series: [
        { type: 'column', name: 'Generated', data: bankSheet },
        { type: 'column', name: 'Not Generated', data: bankSheetMiss }
      ],
      tooltip: { shared: true },
    };

    // 3. PI Invoice Chart
    const piInvoice = filteredData.map(client => client.project?.piInvoiceCount ?? 0);
    const piInvoiceMiss = filteredData.map(client => client.project?.piInvoiceMissCount ?? 0);
    this.pIInvoiceChartOptions = {
      chart: { type: 'column' },
      title: { text: 'PI Invoice ', style: { fontSize: '16px', fontWeight: '500' } },
      xAxis: {
        categories: salarySheetCategories,
        labels: {
          style: { fontSize: '12px', fontWeight: '500' },
          formatter: function () { return String(this.value).slice(0, 5); }
        }
      }, yAxis: { title: { text: 'Count', style: { fontSize: '12px', fontWeight: '500' } }, labels: { style: { fontSize: '12px', fontWeight: '500' } } },
      plotOptions: { column: { stacking: 'normal', grouping: true } },
      credits: { enabled: false },
      series: [
        { type: 'column', name: 'Generated', data: piInvoice },
        { type: 'column', name: 'Not Generated', data: piInvoiceMiss }
      ],
      tooltip: { shared: true },
    };

    // 4. GST Invoice Chart
    const gstInvoice = filteredData.map(client => client.project?.gstInvoiceCount ?? 0);
    const gstInvoiceMiss = filteredData.map(client => client.project?.gstInvoiceMissCount ?? 0);
    this.gstInvoiceChartOptions = {
      chart: { type: 'column' },
      title: { text: 'GST Invoice ', style: { fontSize: '16px', fontWeight: '500' } },
      xAxis: {
        categories: salarySheetCategories,
        labels: {
          style: { fontSize: '12px', fontWeight: '500' },
          formatter: function () { return String(this.value).slice(0, 5); }
        }
      },
      yAxis: { title: { text: 'Count', style: { fontSize: '12px', fontWeight: '500' } }, labels: { style: { fontSize: '12px', fontWeight: '500' } } },
      plotOptions: { column: { stacking: 'normal', grouping: true } },
      credits: { enabled: false },
      series: [
        { type: 'column', name: 'Uploaded', data: gstInvoice },
        { type: 'column', name: 'Not Uploaded', data: gstInvoiceMiss }
      ],
      tooltip: { shared: true },
    };

    // 5. UTR Sheet Chart
    const utrSheet = filteredData.map(client => client.project?.utrCount ?? 0);
    const utrSheetMiss = filteredData.map(client => client.project?.utrMissCount ?? 0);
    this.utrSheetChartOptions = {
      chart: { type: 'column' },
      title: { text: 'UTR Sheet ', style: { fontSize: '16px', fontWeight: '500' } },
      xAxis: {
        categories: salarySheetCategories,
        labels: {
          style: { fontSize: '12px', fontWeight: '500' },
          formatter: function () { return String(this.value).slice(0, 5); }
        }
      }, yAxis: { title: { text: 'Count', style: { fontSize: '12px', fontWeight: '500' } }, labels: { style: { fontSize: '12px', fontWeight: '500' } } },
      plotOptions: { column: { stacking: 'normal', grouping: true } },
      credits: { enabled: false },
      series: [
        { type: 'column', name: 'Uploaded', data: utrSheet },
        { type: 'column', name: 'Not Uploaded', data: utrSheetMiss }
      ],
      tooltip: { shared: true },
    };

    this.updateFlag = true;
  }

}
