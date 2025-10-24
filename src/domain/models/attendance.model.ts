export class CustomAttendanceData {
    date: string = "";
    displayDate: string = "";
    day: string = "";
    totalHours: string = "0:00";
    timeList: TimeList[] = [];
    dailyData: DailyDaum[] = [];
    isHoliday: boolean = false;
    holiday: Holiday = new Holiday();

}
export class Holiday {
    name: string = "";
    type: string = "";
}

export class TimeList {
    hour: string = "";
    minutes: string[] = [];
}

export class EmployeeData {
    id: number = 0;
    employeeId: number = 0;
    fullName: string = "";
    email: string = "";
    mobileNo: string = "";
    dateOfBirth: string = "";
    designation: number = 0;
    designationName: string = "";
    profilePath: string = "";
}


export class EmployeeAttendanceData {
    id: number = 0;
    employeeId: number = 0;
    employeeName: string = "";
    employeeCode: string = "";
    attendaceData: AttendanceDaum[] = []

    totalAbsentDays: number = 0;
    totalHolidays: number = 0;
    totalPresentDays: number = 0;
    totalWorkingDays: number = 0;
}

export class AttendanceDaum {
    strDate: string = "";
    dailyData: DailyDaum[] = [];
    totalDurationOfDay: string = "";
    isHoliday: boolean = false;
    holiday: Holiday = new Holiday();

}



export class ByDateAttendance {
    id: number = 0;
    employeeId: number = 0;
    attendanceDate: string = "";
    inTime: string = "";
    outTime: string = "";
    outOnDutyStatus: boolean = false;
    duration: string = "";
    inTimeLocation: string = "";
    intimeLatitude: string = "";
    intimeLongitude: string = "";
    outTimeLocation: string = "";
    outTimeLatitude: string = "";
    outTimeLongitude: string = "";
}


export class DailyDaum {
    inTime: string = "";
    outTime: string = "";
    duration: string = "";
    inTimeLocation: string = "";
    inTimeLatitude: string = "";
    intimeLongitude: string = "";
    outTimeLocation: string = "";
    outTimeLatitude: string = "";
    outTimeLongitude: string = "";
}
