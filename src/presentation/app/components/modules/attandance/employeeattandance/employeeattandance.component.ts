import { HttpParams } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { AppConstant } from '../../../../../../common/app-constant';
import { ToasterService } from '../../../../../../common/toaster-service';
import { Router } from '@angular/router';
import { EmployeeDesignationHistoryService } from '../../../../../../domain/services/employeedesignationhistory.service';
import { CustomAttendanceData, EmployeeAttendanceData, EmployeeData, TimeList } from '../../../../../../domain/models/attendance.model';
import { EmployeeAttendanceService } from '../../../../../../domain/services/employeeattendance.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-employeeattandance',
  templateUrl: './employeeattandance.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './employeeattandance.component.scss'
})

export class EmployeeattandanceComponent {

  attendanceData: any = [];
  groupedAttendanceData: CustomAttendanceData[] = [];
  expandedDates: { [key: string]: boolean } = {};
  employeeId: number = 0;
  totalCount: number = 0;
  pageNumber: number = 1;
  recode: number = 10;
  searchTerm: string = '';
  filterTerm: string = '';
  orderby: string = '';
  timeList: TimeList[] = [];
  monthList: { label: string, value: number }[] = AppConstant.MONTH_DATA.map(month => ({ label: month.monthName, value: month.id }));
  yearsList: { label: string, value: number }[] = [];
  columns = [
    {
      field: 'attendanceDate',
      displayName: 'Attendance Date',
      sortable: true,
      filterable: true,
      visible: true,
    },
    {
      field: 'inTime',
      displayName: 'In Time',
      sortable: true,
      filterable: true,
      visible: true,
    },
    {
      field: 'outTime',
      displayName: 'Out Time',
      sortable: true,
      filterable: true,
      visible: true,
    },
    {
      field: 'duration',
      displayName: 'Duration',
      sortable: true,
      filterable: true,
      visible: true,
    }
  ];
  currentYear: any;
  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth() + 1;
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);

  constructor(
    private toaster: ToasterService,
    private employeeAttendanceService: EmployeeAttendanceService,
  ) {
    this.getEmployeeId();
    this.getPayrollYears();
  }

  getPayrollYears(): void {
    this.currentYear = new Date().getFullYear();
    for (let year = this.currentYear - 5; year <= this.currentYear; year++) {
      this.yearsList.push({ label: year.toString(), value: year });
    }
  }

  onYearChange(event: any) {
    this.getEmployeeAttendanceData();
    this.getCurrentMonthDates();
  }



  async ngOnInit() {
    this.getCurrentMonthDates();
    console.log("Received Attendance Data:", this.groupedAttendanceData);
    this.generateTimeSlots();

  }
  private generateTimeSlots() {
    const startTime = new Date();
    startTime.setHours(8, 0, 0, 0); 

    const endTime = new Date(startTime);
    endTime.setHours(24, 0, 0, 0); 

    while (startTime < endTime) {
      const hour = startTime.getHours();
      const period = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour > 12 ? hour - 12 : hour; 

      this.timeList.push({
        hour: `${formattedHour} ${period}`,
        minutes: ["00", "30"] 
      });

      startTime.setHours(hour + 1, 0, 0, 0); 
    }


  }


  getCurrentMonthDates() {

    const year = this.selectedYear;
    const month = this.selectedMonth; 

    this.groupedAttendanceData = []; 
    const firstDay = new Date(year, month - 1, 1); 
    const lastDay = new Date(year, month, 0); 
    for (let day = 1; day <= lastDay.getDate(); day++) {
      let data = new CustomAttendanceData();
      const date = new Date(year, month - 1, day); 
      data.displayDate = formatDate(date);
      data.date = date.toString();
      data.day = date.toLocaleDateString('en-US', { weekday: 'long' });
      data.totalHours = "00:00:00";
      data.timeList = [];

      
      let startTime = new Date(year, month - 1, day, 8, 0, 0, 0);
      const endTime = new Date(year, month - 1, day, 12, 0, 0, 0);

      while (startTime < endTime) {
        const hour = startTime.getHours();
        const minutes = startTime.getMinutes().toString().padStart(2, "0"); 
        const period = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour > 12 ? hour - 12 : hour; 

        data.timeList.push({
          hour: `${formattedHour} ${period}`,
          minutes: ["00", "30"] 
        });

        startTime.setMinutes(startTime.getMinutes() + 30); 
      }

      this.groupedAttendanceData.push(data);
    }

    console.log('Updated Data:', this.groupedAttendanceData);
  }

  employeeAttendanceData: EmployeeAttendanceData = new EmployeeAttendanceData();
  getEmployeeAttendanceData() {
    let params = new HttpParams()
      .set("Month", this.selectedMonth)
      .set("Year", this.selectedYear)
      .set("EmployeeId", this.employeeId.toString());

    this.employeeAttendanceService.getEmployeeAttendanceUpload<EmployeeAttendanceData>(AppConstant.POST_CHECK_IN_OUT + '/GetEmployeeAttendance', params).subscribe({
      next: (response) => {
        if (this.groupedAttendanceData.length == 0)
          this.getCurrentMonthDates()

        this.employeeAttendanceData = response.data;

        const today = new Date(); 
        const todayFormatted = today.toISOString().split('T')[0]; 

        this.employeeAttendanceData.attendaceData.forEach(attendance => {
          this.groupedAttendanceData.forEach(element => {


            const date = new Date(element.date);
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); 
            const isoDate1 = date.toISOString().split('T')[0];
            const dateObj = new Date(attendance.strDate);

            if (isoDate1 === attendance.strDate) {

              element.isHoliday = attendance.isHoliday;
              element.totalHours = attendance.totalDurationOfDay;
              element.holiday = attendance.holiday;
              element.dailyData = attendance.dailyData?.map(daily => {
                const isToday = isoDate1 === todayFormatted;
                return {
                  inTime: daily.inTime ?? '',
                  outTime: isToday && !daily.outTime ? new Date().toLocaleTimeString() : daily.outTime ?? '',
                  duration: daily.duration ?? '',
                  inTimeLocation: daily.inTimeLocation ?? '',
                  inTimeLatitude: daily.inTimeLatitude ?? '',
                  intimeLongitude: daily.intimeLongitude ?? '',
                  outTimeLocation: daily.outTimeLocation ?? '',
                  outTimeLatitude: daily.outTimeLatitude ?? '',
                  outTimeLongitude: daily.outTimeLongitude ?? '',
                };
              }) || []; 
            }
          });
        });
        console.log('groupedAttendanceData', this.groupedAttendanceData)
        console.log('employeeAttendanceData', this.employeeAttendanceData)

      }
    });
  }

  calculateTypeWidth(type: string): string {
    if (!this.employeeAttendanceData || this.employeeAttendanceData === null) return '0%';

    const totalWorkingDays = this.employeeAttendanceData.totalWorkingDays || 1;
    const totalPresentDays = this.employeeAttendanceData.totalPresentDays || 0;
    const totalAbsentDays = this.employeeAttendanceData.totalAbsentDays || 0;
    const totalHolidays = this.employeeAttendanceData.totalHolidays || 0;

    switch (type) {
      case 'present':
        return `${(totalPresentDays / totalWorkingDays) * 100}%`;
      case 'absent':
        return `${(totalAbsentDays / totalWorkingDays) * 100}%`;
      case 'holiday':
        return `${(totalHolidays / totalWorkingDays) * 100}%`;
      case 'leave':
        return '0%'; 
      default:
        return '0%';
    }
  }



  checkAttendanceMatch(item: CustomAttendanceData): boolean {

    if (!item.dailyData || item.dailyData.length === 0) {
      return false;
    }

    if (item.dailyData.length > 0) {
      return true;
    }


    return false;
  }

  checkAttendanceDate(item: CustomAttendanceData): boolean {

    const isoDate1 = new Date(item.date).toISOString().split('T')[0]; 
    const isoDate2 = new Date().toISOString().split('T')[0];

    if (isoDate1 <= isoDate2) {
      return false;
    }
    return true;
  }





  async getEmployeeId() {
    this.employeeAttendanceService.getEmployeeAttendanceUpload<EmployeeData>(AppConstant.GET_EMPLOYEE_ID).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.employeeId = response.data.employeeId;
          this.getEmployeeAttendanceData();

        } else {
        }
      }
    });
  }

  groupAttendanceData() {
    if (!this.attendanceData || !Array.isArray(this.attendanceData)) {
      console.error("attendanceData is missing or not an array", this.attendanceData);
      return;
    }
    const grouped = this.attendanceData.reduce((acc: any, record: any) => {
      if (!record.attendaceData || !Array.isArray(record.attendaceData)) {
        return acc;
      }
      record.attendaceData.forEach((attendance: any) => {
        if (!attendance.date) {
          return;
        }
        const date = attendance.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        if (attendance.dailyData && Array.isArray(attendance.dailyData)) {
          attendance.dailyData.forEach((entry: any) => {
            acc[date].push({
              employeeId: record.employeeId || "N/A",
              employeeName: record.employeeName || "Unknown",
              inTime: entry.inTime || "N/A",
              outTime: entry.outTime || "N/A",
              duration: entry.duration || "N/A",
            });
          });
        }
      });
      return acc;
    }, {} as { [key: string]: any[] });
    
  }


  formatTime(timeString: string): string {
    if (!timeString) return 'N/A';

    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds);

    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  calculateGraphWidth(item: CustomAttendanceData): number {
    if (!item.dailyData || item.dailyData.length === 0) {
      return 0;
    }

    const convertToMinutes = (time: string): number => {
      if (!time) return -1;
      const [hh, mm, ss] = time.split(":").map(Number);
      return hh * 60 + mm; 
    };

    let totalWidth = 0;

    for (const attendance of item.dailyData) {
      const inTimeMin = convertToMinutes(attendance.inTime);
      const outTimeMin = convertToMinutes(attendance.outTime);

      if (inTimeMin === -1 || outTimeMin === -1) {
        continue;
      }

      const duration = outTimeMin - inTimeMin;
      totalWidth += (duration / 30) * 50; 
    }

    return totalWidth;
  }

  calculateGraphStartPosition(item: CustomAttendanceData): number {
    if (!item.dailyData || item.dailyData.length === 0) {
      return 0;
    }

    const convertToMinutes = (time: string): number => {
      if (!time) return -1;
      const [hh, mm, ss] = time.split(":").map(Number);
      return hh * 60 + mm;
    };

    const startOfDayMinutes = 8 * 60; 
    const firstAttendance = item.dailyData[0]; 
    const inTimeMin = convertToMinutes(firstAttendance.inTime);

    if (inTimeMin === -1 || inTimeMin < startOfDayMinutes) {
      return 0; 
    }

    const startPosition = ((inTimeMin - startOfDayMinutes) / 30) * 50; 
    return startPosition;
  }

}

function formatDate(date: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const dayOfWeek = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];

  const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  return `${dayOfWeek}, ${day}${getDaySuffix(day)} ${month}`;
}
