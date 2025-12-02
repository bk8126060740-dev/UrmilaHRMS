import { environment } from '../environments/environment';

export class AppConstant {

  public static readonly BASE_URL = environment.apiUrl;
  public static readonly BASE_IMAGEURL: string = "https://hrmsuistech.in/";
  public static readonly LOGIN: string = "Account/login";
  public static readonly FORGOT_PASSWORD: string = "Account/ForgotPassword";
  public static readonly REFRESH_TOKEN: string = "Account/Token";
  public static readonly VALIDATE_TOKEN: string = "EmployeeAccount/validate-token";
  public static readonly RESET_PASSWORD: string = "EmployeeAccount/ResetPassword";
  public static readonly CODE: string = 'Code/';
  public static readonly GET_CODETYPE: string = "CodeType";
  public static readonly POST_CODETYPE: string = "CodeType";
  public static readonly DESIGNATION: string = "Designation";
  public static readonly DELETE_CODETYPE: string = "CodeType/";
  public static readonly PUT_CODETYPE: string = "CodeType/";
  public static readonly GET_CLIENT: string = "Client";
  public static readonly POST_CLIENT: string = "Client";
  public static readonly PUT_CLIENT: string = "Client";
  public static readonly GET_EXPORT_CLIENT: string = "Client/ExcelExport";
  public static readonly DELETE_CLIENT: string = "Client";
  public static readonly PATCH_UPDATEDEFAULTCODE: string = "Code/UpdateDefaultCode";
  public static readonly GET_PROJECT: string = "Project";
  public static readonly GET_EXPORT_PROJECT: string = "Project/ExcelExport";
  public static readonly GET_EXPORT_CANDIDATE: string = "Candidate/ExcelExport";
  public static readonly POST_PROJECT: string = "Project";
  public static readonly PUT_PROJECT: string = "Project";
  public static readonly DELETE_PROJECT: string = "Project";
  public static readonly GET_CLIENTDROPDOWN: string = "Client/GetClientsForDropdown";
  public static readonly GET_ALLCODESBYCODETYPES: string = "Code/GetAllCodesByCodeTypes";
  public static readonly GET_MENUS: string = "Menu";
  public static readonly GET_FILE: string = "Files";
  public static readonly GET_FILTER: string = "Screen/ScreenGrid/";
  public static readonly GET_PAYROLL_ATTRIBUTE: string = "PayrollAttribute/GetAll";
  public static readonly GET_PAYROLLATTRIBUTE_BY_PAYROLLID: string = "Project/GetPayrollAttributebyPayrollId?payrollId=";
  public static readonly POST_PAYROLL_ATTRIBUTE: string = "PayrollAttribute/SetSequence";
  public static readonly PAYROLL_BANK_SHEET_UTR_UPLOAD: string = 'PayrollBankSheet/UTRAttachment';
  public static readonly GET_BANK_SHEET_REPORT_BY_ID: string = 'PayrollBankSheet/Report/ByBankSheetId';
  public static readonly GET_BANK_SHEET_REPORT: string = 'PayrollBankSheet/Report/BankSheetReport';
  public static readonly GET_DEPARTMENTMASTER: string = "Department";
  public static readonly GET_CLIENT_ATTENDANCE_COUNTS: string = "ChartMetric/ClientAttendanceCounts";
  public static readonly GET_CLIENT_PAYROLL_COUNTS: string = "ChartMetric/ClientPayrollCounts";
  public static readonly GET_BANKRESOURCE: string = "BankResource";
  public static readonly GET_BANKRESOURCE_CODE: string = "Code";
  public static readonly POST_DEPARTMENTMASTER: string = "Department/Department";
  public static readonly PUT_DEPARTMENTMASTER: string = "Department";
  public static readonly DELETE_DEPARTMENTMASTER: string = "Department/Department?id=";
  public static readonly POST_PAYROLL: string = "PayrollAttribute";
  public static readonly PUT_PAYROLL: string = "PayrollAttribute/";
  public static readonly DELETE_PAYROLL: string = "PayrollAttribute/";
  public static readonly GET_CLIENTSTATE: number[] = [1];
  public static readonly GET_PROJECTHOLIDAYCALENDER: string = "ProjectHolidayCalender";
  public static readonly POST_PROJECTHOLIDAYCALENDER: string = "ProjectHolidayCalender";
  public static readonly PUT_PROJECTHOLIDAYCALENDER: string = "ProjectHolidayCalender/";
  public static readonly DELETE_PROJECTHOLIDAYCALENDER: string = "ProjectHolidayCalender/";
  public static readonly GET_PROJECTATTRIBUTE: string = "ProjectPayrollAttribute";
  public static readonly GET_PROJECTATTRIBUTEBYPROJECT: string = "ProjectPayrollAttribute/byProject/";
  public static readonly GET_PROJECTATTRIBUTEBYPROJECTEWITHOUTFILTER: string = "ProjectPayrollAttribute/GetAllByProjectIdWithoutFilter/";
  public static readonly GET_PROJECTHOLIDAYCALENDERBYPROJECT: string = "ProjectHolidayCalender";
  public static readonly POST_PROJECTATTRIBUTE: string = "ProjectPayrollAttribute";
  public static readonly DELETE_PROJECTPAYROLLATTRIBUTE: string = "ProjectPayrollAttribute/";
  public static readonly GET_PROJECTDROPDOWN: string = "Project/GetListOfIdAndName";
  public static readonly GET_EMPLOYEEDROPDOWN: string = "User/GetAll";
  public static readonly GET_USER_SEARCH: string = "User/Search?";
  public static readonly PUT_PASSWORD: string = "User/UpdatePassword";
  public static readonly GET_STATE: string = "Location/GetAllStates";
  public static readonly GET_CITY: string = "Location/GetAllCities";
  public static readonly GET_EMPLOYEEBYID: string = "Employee";
  public static readonly GET_EMPLOYEE_ADDRESS: string = "Addresses";
  public static readonly PUT_EMPLOYEE_ADDRESS: string = "Employee/UpdateAddresses";
  public static readonly DELETE_EMPLOYEE_EXPERIENCE: string = "Employee/Experience";
  public static readonly DELETE_EMPLOYEE_QUALIFICATION: string = "Employee/Qualification";
  public static readonly DELETE_EMPLOYEE_SALARYSLIP: string = "Employee/SalarySlip";
  public static readonly POST_EMPLOYEE_FINANCE: string = "Employee/FinDetails";
  public static readonly POST_BULK_ONBOARD: string = "Employee/UploadExcel";
  public static readonly GET_ALLEMPLOYE_ONBOARD: string = "Employee/GetAllEmployeeOnBoardings";
  public static readonly GET_DOWNLOADUPLOADEDFILE: string = "Files/DownloadUploadedFile";
  public static readonly GET_EMPLOYEEATTENDANCEDOWNLOADUPLOADEDFILE: string = "EmployeeAttendanceUpload/DownloadAttendanceTemplate";
  public static readonly GET_DOWNLOADUPLOADEDFILES: string = "Files/DownloadUploadedFile?";
  public static readonly POST_EMPLOYEEATTENDANCEDOWNLOADUPLOADEDFILE: string = "EmployeeAttendanceUpload/AttendanceExcel";
  public static readonly POST_CHECK_IN_OUT: string = "EmployeeAttendance";
  public static readonly GET_EMPLOYEE_ID: string = "Account/GetUserById";
  public static readonly CUSTOM_REPORT: string = "CustomReport";
  public static readonly BUILDER_TABLE_ID_NAME: string = "CustomReport/BuilderTableIdAndName";
  public static readonly GET_ALL_CUSTOM_REPORT: string = 'CustomReport/CustomReportWithoutPagination'
  public static readonly GET_ALL_APPROVED_PAYROLL: string = 'CustomReport/GetAllApprovedPayrolls'
  public static readonly GET_TABLE_DATA: string = 'CustomReport/GetTableData'
  public static readonly GENERATE_REPORT: string = 'CustomReport/Generate';
  public static readonly GET_PROJECTATTENDACEID: string = "EmployeeAttendanceUpload/GetProjectAttendanceUpload?";
  public static readonly GET_EMPLOYEEATTENDACEID: string = "EmployeeAttendanceUpload/GetEmployeeAttendanceUpload?";
  public static readonly GET_EMPLOYEEATTENDANCEUPLOADEDDATA: string = "EmployeeAttendanceUpload/GetByYearProjectAttendance";
  public static readonly PUT_EMPLOYEEATTENDANCEUPDATE: string = "EmployeeAttendanceUpload/UpdateAttendance";
  public static readonly PUT_PROJECTATTENDANCESTATUS: string = "EmployeeAttendanceUpload/UpdateProjectAttendnaceStatus";
  public static readonly GET_ALLEMPLOYEE: string = "Employee/AllEmployee";
  public static readonly GET_ALLEMPLOYEE_ID: string = "Employee/GetEmployeeId";
  public static readonly GET_ALL_AGENCY: string = "Agency/GetAllAgency";
  public static readonly GET_ALL_DOCUMENT: string = "Document/GetAllDocument";
  public static readonly NOTIFICATION: string = "Notification"
  public static readonly GET_EXPORT_PAYROLL: string = "Payroll/ExportPayrollSummaryToExcel";
  public static readonly GET_EMPLOYEE_DESIGNATION_HISTORY: string = "Employee";
  public static readonly POST_EMPLOYEE_DESIGNATION_HISTORY: string = "Employee/EmployeeDesignationHistory";
  public static readonly POST_EMPLOYEE_ATTENDANCE_SYNC: string = "EmployeeAttendanceUpload/EmployeeAttendanceSync";
  public static readonly GET_ATTENDANCE_BY_DATE: string = 'EmployeeAttendance/GetEmployeeAttendanceByDate';
  public static readonly PAYROLL: string = "Payroll";
  public static readonly GET_SALARY_SLIP: string = "Payroll/GetEmployeeSalarySlip";
  public static readonly GET_TAX_INVOICE: string = "Payroll/GetTaxInvoiceFile/";
  public static readonly UPLOAD_TAX_INVOICE: string = "Payroll/UploadTaxInvoiceFile"
  public static readonly DELETE_TAX_INVOICE: string = "Payroll/DeleteFileUploadTaxInvoice/";
  public static readonly GET_ALL_PAYROLLEMPLOYEESUMMARY: string = "Payroll/GetAllPayrollEmployeeSummary?";
  public static readonly GET_BANK_SEARCH: string = "BankResource/Search";
  public static readonly GET_PAYROLL_ATTENDANCE: string = "Payroll/GetProjectAttendance";
  public static readonly GET_PAYROLL_BY_PROJECT: string = "Payroll/GetPayrollsByProject";
  public static readonly GET_ALL_GRIEVANCE: string = "Grievance";
  public static readonly GET_ALL_GRIEVANCE_COMMENT: string = "Grievance/GetAllGrievanceComment";
  public static readonly POST_GRIEVANCE_COMMENT: string = "Grievance/GrievanceComment";
  public static readonly POST_GRIEVANCE_COMMENT_ATTACHMENT: string = "Grievance/GrievanceCommentAttachment";
  public static readonly POST_ASSIGN_TICKET: string = "Grievance/BulkAssignEmployees";
  public static readonly POST_GET_LIST_OF_HO: string = "Employee/GetListOfHoIdAndName";
  public static readonly GET_LIST_SUBCLASSIFICATIONBYID: string = "Grievance/GrievanceSubClassificationByClassificationId";
  public static readonly POST_GET_ALLLCODESTYPE: string = "Code/GetAllCodesByCodeTypes";
  public static readonly GET_ALL_GRIEVANCE_CLASSIFICATION: string = "Grievance/GetAllGrievanceClassification";
  public static readonly GET_EMPLOYEE_SEARCH: string = "Employee/Search";
  public static readonly POST_PAYROLLATTRIBUTE: string = "Employee/PayrollAttribute";
  public static readonly SETPROJECT: String = "SetProject/set-project";
  public static readonly CANDIDATE: string = "Candidate";
  public static readonly DELETE_CANDIDATE_EXPERIENCE: string = "Candidate/Experience";
  public static readonly DELETE_CANDIDATE_QUALIFICATION: string = "Candidate/Qualification";
  public static readonly JOBPOSTOION: string = "JobPosition";
  public static readonly JOB_POSITION: string = "JobPosition";
  public static readonly POST_EMPLOYEE_DESIGNATION: string = "Employee/EmployeeDesignationHistory";
  public static readonly GET_DEPARTMENT_DROPDOWN: string = 'Department';
  public static readonly SET_SEQUENCE_PROJECT_PAYROLL: string = 'ProjectPayrollAttribute/SetSequence';
  public static readonly GET_SALARY_SHEET_LIST: string = 'Project/GetAllBankSheetFileByPayrollId';
  public static readonly POST_GROUP: string = 'Group';
  public static readonly GET_GROUP_SCREENS: string = 'PermissionsDashboard/GetScreens';
  public static readonly GET_SUBMENU_SCREENS: string = 'CustomPermissions/GetScreenWisePermission';
  public static readonly POST_PERMISSION_MAIN_MENU: string = 'PermissionsDashboard/ActiveScreenPermissionMainMenu';
  public static readonly GET_SUBSCREEN_PERMISION: string = 'PermissionsDashboard/GetScreenPermissions';
  public static readonly GET_PERMISSION: string = 'Permission';
  public static readonly REMOVE_SCREENWISE_PERMISSION: string = 'CustomPermissions/RemoveScreenWisePermission';
  public static readonly SAVE_PERMISSION: string = 'PermissionsDashboard/SaveScreenPermission';
  public static readonly USER_GROUP: string = 'Group/UserGroups?UserId=';
    public static readonly POST_ASSIGN_USER: string = 'Group/AssignUser';
  public static readonly GET_PAYMENT_RECEVIABLE_INVOICE: string = 'PaymentReceivable/GetInvoices';
  public static readonly POST_PAYMENT_RECEVIABLE: string = 'PaymentReceivable';
  public static readonly DELETE_PAYMENT_RECEIVABLE: string = 'PaymentReceivable';
  public static readonly GET_PAYMENT_RECEVIABLE_REPORT: string = 'PaymentReceivable/PaymentReceviableReport';
  public static readonly GET_OFFER_LETTER: string = 'CandidateSalaryBreakDown';
  public static readonly GET_PF_CHALLAN_HISTORY: string = 'PayrollPF/ChallanHistory';
  public static readonly POST_PF_CHALLAN: string = 'PayrollPF/Report';
  public static readonly GET_PF_CONTRIBUTION_REPORT: string = 'PayrollPF/Report/PFReport';
  public static readonly GET_CHALLAN_HISTORY_BY_ID = 'PayrollPF/ChallanHistorybyId'
  public static readonly DELETE_PF_CHALLAN: string = 'PayrollPF/Delete';
  public static readonly GET_ESIC_CHALLAN_HISTORY: string = 'PayrollESIC/ESICChallanHistory';
  public static readonly POST_ESIC_CHALLAN: string = 'PayrollESIC/ESICReport';
  public static readonly GET_ESIC_CONTRIBUTION_REPORT: string = 'PayrollESIC/Report/ESICReport';
  public static readonly GET_CHALLAN_HISTORY_BY_ID_ESIC = 'PayrollESIC/ChallanHistorybyId'
  public static readonly DELETE_ESIC_CHALLAN: string = 'PayrollESIC/Delete';
  public static readonly GET_REPORT: string = 'Report';
  public static readonly K_TOKEN: string = 'access_token';
  public static readonly T_TOKEN: string = 'Taccess_token';
  public static readonly PROJECTID: string = 'PROJECTID';
  public static readonly PROJECTNAME: string = 'PROJECTNAME';
  public static readonly APP_THEME: string = 'APP_THEME';
  public static readonly GRID_PROJECT: number = 1;
  public static readonly GRID_CLIENT: number = 2;
  public static readonly GRID_RECRUITMENT: number = 3;
  public static readonly APPLIED: number = 108;
  public static readonly SORTLISTED: number = 109;
  public static readonly HR_REJECTED: number = 110;
  public static readonly INTERVIEW_SCHEDULED: number = 111;
  public static readonly REJECTED_FROM_INTERVIEW: number = 112;
  public static readonly SELECTED_FROM_INTERVIEW: number = 113;
  public static readonly HR_OFFER_SENT: number = 114;
  public static readonly CANDIDATE_OFFER_ACCEPT: number = 115;
  public static readonly CANDIDATE_OFFER_REJECTED: number = 116;
  public static readonly ONBAORDING_STARTED: number = 117;
  public static readonly ONBAORDING_COMPLETED: number = 118;
  public static readonly HIRING_MANAGER_APPROVED: number = 119;
  public static readonly HR_ON_HOLD: number = 120;
  public static readonly CANDIDATE_ON_HOLD: number = 138;
  public static readonly OFFER_PENDING: number = 139;
  public static readonly CEO: number = 128;
  public static readonly SUPER_ADMIN: number = 129;
  public static readonly ADMIN: number = 130;
  public static readonly HR_MANAGER: number = 131;
  public static readonly HR: number = 132;
  public static readonly PROJECT_MANAGER: number = 133;
  public static readonly FINANACE_MANAGER: number = 134;
  public static readonly FINANACE: number = 135;
  public static readonly EMPLOYEE: number = 136;
  public static readonly EmployeeReffral: number = 7;
  public static readonly BANKRESOURCE_CODE: number = 53;
  public static readonly PAYROLL_TEXT_INVOICE_ATTACHMENT: string = 'PayrollTaxInvoiceAttachment';
  public static readonly PAYROLL_PDF_ATTACHMENT: string = 'PayrollPFAttachment';
  public static readonly PAYROLL_ESIC_ATTACHMENT: string = 'PayrollESICAttachment';
  public static readonly PAYROLL_BANK_SHEET: string = 'PayrollBankSheet';
    public static readonly Bank_Transfer_List: string = 'Payments';
  public static readonly GET_PAYROLL_BANK_SHEET: string = 'PayrollBankSheet';
  public static readonly GET_CLIENT_SEARCH: string = 'Client/Search';
  public static readonly GET_Account_SEARCH: string = 'CustomReport/GetAccountColumn';
  public static readonly Get_Invoice_Files: string = 'CustomReport/GetInvoiceFiles';
  public static readonly Save_MultipleInvoice_Files: string = 'CustomReport/SaveMultipleInvoiceFiles';
  public static readonly GET_PERFORMA_INVOICE: string = 'Project/GenerateInvoice';
  public static readonly OPERATORS: string[] = ["+", "-", "*", "/", "(", ")", "IF", ",", "%", "<", ">", "=", "ROUNDUP", "ROUND", "&&", "||"];
  public static readonly PROJECT_DROPDOWN: number[] = [2, 5, 6, 7, 8, 9, 12, 10,];
  public static readonly GET_HOLIDAYTYPEARRAY: number[] = [6];
  public static readonly CLIENT_LEDER_ONE: string = '1';
  public static readonly CLIENT_LEDER_TWO: string = '2';
  public static readonly CLIENT_LEDER_THREE: string = '3';
  public static readonly GETWEEKOFF: number[] = [3];
  public static readonly GETGENDER: number[] = [4];
  public static readonly GETDOCUMENTTYPE: number[] = [4];
  public static readonly GETVERIFICATIONTYPE: number[] = [33];
  public static readonly GET_DESIGNATION: number[] = [26];
  public static readonly GET_GROUP: number[] = [44];
  public static readonly GETCANDIDATESTATUS: number[] = [35];
  public static readonly JOB_CREATE_DROPDOWN: number[] = [25, 15, 17, 18, 19, 20, 21, 22, 23, 19, 36,];
  public static readonly LEADER_DROPDOWN: number[] = [128, 129, 130, 131, 132, 133];
  public static readonly DAYSIN_MONTH: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  public static readonly YEARS: number[] = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034]
  public static readonly MONTH_DATA = [
    { id: 1, monthName: 'January', shortName: 'Jan' },
    { id: 2, monthName: 'February', shortName: 'Feb' },
    { id: 3, monthName: 'March', shortName: 'Mar' },
    { id: 4, monthName: 'April', shortName: 'Apr' },
    { id: 5, monthName: 'May', shortName: 'May' },
    { id: 6, monthName: 'June', shortName: 'Jun' },
    { id: 7, monthName: 'July', shortName: 'Jul' },
    { id: 8, monthName: 'August', shortName: 'Aug' },
    { id: 9, monthName: 'September', shortName: 'Sep' },
    { id: 10, monthName: 'October', shortName: 'Oct' },
    { id: 11, monthName: 'November', shortName: 'Nov' },
    { id: 12, monthName: 'December', shortName: 'Dec' }
  ];
  public static readonly PROJECT_ATTENDANCE_APPROVE: number = 178;
  public static readonly PROJECT_ATTENDANCE_REJECT: number = 179;
  public static readonly PAYROLL_APPROVE: number = 146;
  public static readonly PAYROLL_REJECT: number = 147;
  public static readonly NOTPERMISSION = "You don't have permission to access this feature."
  public static readonly FILE5MB: number = 5242880;
  public static readonly FILE30MB: number = 31870621;
  public static getDownloadFile(fileName: string) {
    window.open(fileName, "_blank");
  }
  public static getActualFileName(fileUrl: string): string {
    try {
      const url = new URL(fileUrl);
      const pathname = decodeURIComponent(url.pathname);
      const newPathname = pathname.substring(pathname.lastIndexOf("/") + 1).split("?")[0];
      const fullFileName = newPathname.substring(newPathname.lastIndexOf("\\") + 1);
      return fullFileName.replace(/^(\d+_)+/, "");
    } catch (error) {
      console.error("Invalid URL:", error);
      return "";
    }
  }

}
