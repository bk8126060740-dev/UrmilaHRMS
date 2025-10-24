import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild, ViewEncapsulation, } from "@angular/core";
import { AppConstant } from "../../../../../../common/app-constant";
import { GlobalConfiguration } from "../../../../../../common/global-configration";
import { HttpParams } from "@angular/common/http";
import { AddEnudumModel, ClientDropdown, Code, CodeType, EmployeeDropdown, ProjectDaum, } from "../../../../../../domain/models/project.model";
import { ToastrService } from "ngx-toastr";
import { ProjectService } from "../../../../../../domain/services/project.service";
import { ModalDirective } from "ngx-bootstrap/modal";
import { Router } from "@angular/router";
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, NgModel, Validators, } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import swal from "sweetalert";
import { HeaderComponent } from "../../../core/header/header.component";
import { HeaderDropdownService } from "../../../../../../domain/services/header-dropdown.service";
import { GrantPermissionService } from "../../../../../../domain/services/permission/is-granted.service";
import { BasicLayoutComponent } from "../../../core/basic-layout/basic-layout.component";
import { NgSelectComponent } from "@ng-select/ng-select";

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './project-create.component.scss',
})
export class ProjectCreateComponent {
  totalCount: number = 0;
  profilePicUrl: any;
  nextId: number = 1;
  projectForm: FormGroup;
  minEndDate: Date | null = null;
  projectEnumDataModel: ProjectDaum = new ProjectDaum();
  projectDataModel: ProjectDaum = new ProjectDaum();
  clientDropdownData: ClientDropdown[] = [];
  codeTypes: CodeType[] = [];
  projectStatusArray: Code[] = [];
  employeeDropdownData: EmployeeDropdown[] = [];
  projectManagerDropdownData: EmployeeDropdown[] = [];
  leaderDropdownData: EmployeeDropdown[] = [];
  projectNatureTypeArray: Code[] = [];
  deliveryModelTypeArray: Code[] = [];
  projectResourceTypeArray: Code[] = [];
  projectAttendanceTypeArray: Code[] = [];
  paymentTypeArray: Code[] = [];
  shiftTypeArray: Code[] = [];
  EnumDocUrl: SafeResourceUrl | null = null;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  isFileInputOpen: boolean = false;
  profilePicRequired = false;
  modalTitle: string = 'Add endum';
  addEnudumDataModel: AddEnudumModel = new AddEnudumModel();
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);
  addendumData: {
    addendumId: number;
    title: string;
    description: string;
    location: string;
    document?: File;
    documentPath: string;
    documentUrl?: SafeResourceUrl;
    uploadAddEndNumsFlag: number;
  }[] = [];
  UploadFlag: number = 3;
  isEditMode: boolean = false;

  @ViewChild('inputEnumFile') inputEnumFile!: ElementRef<HTMLInputElement>;
  @ViewChild('AddEnumDumModel', { static: false }) public addEnuDumModel:
    | ModalDirective
    | undefined;
  @ViewChild('projectendumForm', { static: false }) projectendumForm!: NgForm;
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  @ViewChild('projectManagerSelect', { static: false }) projectManagerSelect!: NgSelectComponent;
  @ViewChild('leader1Select') leader1Select!: NgSelectComponent;
  @ViewChild('leader2Select') leader2Select!: NgSelectComponent;
  constructor(
    private projectService: ProjectService,
    private toaster: ToastrService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private headerDropdownService: HeaderDropdownService,
    private basicLayoutComponent: BasicLayoutComponent,
    private cd: ChangeDetectorRef
  ) {
    this.projectForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', [Validators.required, this.endDateValidator.bind(this)]],
    });
  }

  endDateValidator(control: AbstractControl) {
    const startDate = this.projectForm?.get('startDate')?.value;
    const endDate = control.value;

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return { dateRange: true }; 
    }
    return null; 
  }

  ngOnInit(): void {

    if (history.state.ProjectData != null || history.state.ProjectData != undefined) {
      this.projectDataModel = history.state.ProjectData;
      this.isEditMode = true;
      if (this.projectDataModel.profilePicPath) {
        this.profilePicUrl = this.projectDataModel.profilePicPath;
        this.UploadFlag = 3;
      }
    } else {
      this.isEditMode = false;
    }
    if (history.state.projectAddendums != null || history.state.projectAddendums != undefined) {
      this.addendumData = history.state.projectAddendums;
      this.addendumData.forEach(element => {
        element.documentPath = element.documentPath.replace(/\d+_/, "");
        element.uploadAddEndNumsFlag = 3;
      });
    } else {
      this.addendumData = [];
    }
    if (history.state.clientData != null || history.state.clientData != undefined) {
      this.projectDataModel.clientId = history.state.clientData.id;
    }
    this.getClientDropdownData();
    this.getAllCodesByCodeTypesDropdown();
    let objProjectManager = {
      designations: []
    }
    let objLeader = {
      designations: []
    }
    this.getProjectManagerData(objProjectManager, 'PM');
    this.getProjectManagerData(objLeader, 'Leader');
  }

  ngAfterViewInit() {
    this.resetAllSelectsField();
  }

  resetAllSelectsField() {
    if (this.isEditMode) {
      return;
    }
    this.projectDataModel.projectManager = null;
    this.projectDataModel.leader1 = null;
    this.projectDataModel.leader2 = null;

    this.cd.detectChanges();

    setTimeout(() => {
      this.resetSelect(this.projectManagerSelect);
      this.resetSelect(this.leader1Select);
      this.resetSelect(this.leader2Select);
      this.cd.detectChanges();
    }, 100);
  }

  private resetSelect(select: NgSelectComponent) {
    if (!select) return;
    if (typeof select.clearModel === 'function') {
      select.clearModel();
    }
    select.writeValue(undefined);
    select.searchTerm = '';
    select.close();
    const inputElement = select.element.querySelector('input');
    if (inputElement) {
      inputElement.blur();
    }
  }

  downloadInvoice(projectId: number) {
    let formData = new FormData();
    formData.append('ProjectId', projectId.toString())
    this.projectService.getDownloadUploadFile(AppConstant.GET_PROJECT + '/GenerateInvoice', formData).subscribe({
      next: (blob: Blob) => {
        if (blob && blob instanceof Blob) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = this.projectDataModel.name + '_Invoice.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      },
      error: (error) => {
        this.toaster.error('Payroll not found.')
      }
    });
  }

  downloadUTR(projectId: number) {
    const params = new HttpParams()
      .set('projectId', projectId.toString());
    this.projectService.getFileName(AppConstant.PAYROLL_BANK_SHEET + '/ByProjectId', params).subscribe({
      next: (response) => {
        if (response && response.success && response.data?.filePath) {
          const filePath = response.data.filePath;
          AppConstant.getDownloadFile(filePath);
        }
      }
    });
  }



  downloadPF(projectId: number) {
    const params = new HttpParams()
      .set('projectId', projectId.toString());
    this.projectService.getFileName(AppConstant.PAYROLL_PDF_ATTACHMENT, params).subscribe({
      next: (response) => {
        if (response && response.success && response.data[0].filePath) {
          const filePath = response.data[0].filePath;
          AppConstant.getDownloadFile(filePath);
        }
      }
    });
  }



  downloadESIC(projectId: number) {
    const params = new HttpParams()
      .set('projectId', projectId.toString());
    this.projectService.getFileName(AppConstant.PAYROLL_ESIC_ATTACHMENT, params).subscribe({
      next: (response) => {
        if (response && response.success && response.data[0].filePath) {
          const filePath = response.data[0].filePath;
          AppConstant.getDownloadFile(filePath);
        }
      }
    });
  }

  async getClientDropdownData(params?: HttpParams) {
    (await this.projectService.getClientDropdownData(`${AppConstant.GET_CLIENT_SEARCH}`, params)).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.clientDropdownData = response.data;
        }
      }
    });
  }

  getAllCodesByCodeTypesDropdown() {
    let obj = {
      codeTypeIds: AppConstant.PROJECT_DROPDOWN,
    };
    (this.projectService.getAllCodesByCodeTypesDropdownData(obj, `${AppConstant.GET_ALLCODESBYCODETYPES}`)).subscribe({
      next: (response) => {
        if (response && response.success) {

          this.codeTypes = response.data;
          for (var i = 0; i < this.codeTypes.length; i++) {
            if (this.codeTypes[i].name === 'Project Status') {
              this.projectStatusArray = this.codeTypes[i].codes;
            } else if (this.codeTypes[i].name === 'Project Nature Type') {
              this.projectNatureTypeArray = this.codeTypes[i].codes;
            } else if (this.codeTypes[i].name === 'Delivery Mode Type') {
              this.deliveryModelTypeArray = this.codeTypes[i].codes;
            } else if (this.codeTypes[i].name === 'Project Resource Type') {
              this.projectResourceTypeArray = this.codeTypes[i].codes;
            } else if (this.codeTypes[i].name === 'Project Attendance Type') {
              this.projectAttendanceTypeArray = this.codeTypes[i].codes;
            } else if (this.codeTypes[i].name === 'Payment Type') {
              this.paymentTypeArray = this.codeTypes[i].codes;
            } else if (this.codeTypes[i].name === 'Project Shift') {
              this.shiftTypeArray = this.codeTypes[i].codes;
            }
          }
        }
      }
    });
  }

  async getEmployeeDropdownData() {
    await this.projectService.getEmployeeDropdownData(`${AppConstant.GET_EMPLOYEEDROPDOWN}`).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.employeeDropdownData = response.data;
        }
      }
    });


  }
  async getProjectManagerData(obj: any, value: any) {

    await this.projectService.postEmployeeDropdownData(AppConstant.GET_EMPLOYEEBYID + "/GetListOfHoIdAndName", obj).subscribe({
      next: (response) => {
        if (response && response.success) {
          if (value === 'PM') {
            this.projectManagerDropdownData = response.data;
          } else {
            this.leaderDropdownData = response.data;
          }
        }
      }
    })
  }

  triggerProfileFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onProfileFileSelected(event: Event) {
    this.profilePicRequired = false;
    const profileInfoElement = this.elRef.nativeElement.querySelector('.profile-info');
    if (profileInfoElement) {
      this.renderer.removeClass(profileInfoElement, 'profile-error');
    }
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      if (!this.isValidProfileFileType(file)) {
        this.toaster.error("Invalid Profile Picture. Please upload a file in JPG,JPEG, or PNG format.");
        if (!this.profilePicUrl) {
          this.profilePicRequired = true;
          input.value = "";
          this.profilePicUrl = null;
        }
        return;
      } else {
        this.UploadFlag = 1;
        this.projectDataModel.profilePicFile = file;
        this.projectDataModel.profilePicPath = "file added"
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          this.profilePicUrl = e.target?.result;
        };
        reader.readAsDataURL(file);
      }
      if (!this.isValidProfileFileSize(file)) {
        this.toaster.error('Profile picture upload failed. Please ensure the file size does not exceed the 2 MB limit.');
        this.profilePicRequired = true;
        input.value = '';
        this.profilePicUrl = null;
        return;
      }
    }
  }

  private isValidProfileFileType(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png'];
    return validTypes.includes(file.type);
  }

  private isValidProfileFileSize(file: File): boolean {
    const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
    return file.size <= maxSize;
  }

  onStartDateChange(event: any, endDate: NgModel) {
    this.minEndDate = event.value;

    if (
      this.projectDataModel.endDate &&
      new Date(this.projectDataModel.endDate) < new Date(this.projectDataModel.startDate)
    ) {
      endDate.control.setErrors({ dateRange: true });
    } else {
      endDate.control.setErrors(null); // Clear the error if dates are valid
    }
  }

  addEndum() {
    this.projectendumForm.resetForm();
    this.selectedFile = null;
    this.selectedFileName = null;
    this.EnumDocUrl = null;
    this.addEnudumDataModel = new AddEnudumModel();
    this.modalTitle = 'Addendum';
    this.addEnuDumModel?.show();
  }

  triggerEnumDocumentFileInput() {
    if (this.inputEnumFile) {
      this.inputEnumFile.nativeElement.value = '';
      this.inputEnumFile.nativeElement.click();
    }
  }

  removeProfilePicture() {
    this.profilePicUrl = null;
    const fileInput = document.querySelector('input[name="profilePicPath"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onEnumDocumentFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.addEnudumDataModel.uploadAddEndNumsFlag = 1;
      this.selectedFile = file;
      this.selectedFileName = file.name;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.EnumDocUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      this.isFileInputOpen = false;
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.selectedFileName = null;
    this.EnumDocUrl = null;
    this.addEnudumDataModel.documentPath = '';
    this.addEnudumDataModel.document = undefined;
    this.inputEnumFile.nativeElement.value = '';

    const index = this.addendumData.findIndex((item) => item.addendumId === this.addEnudumDataModel.addendumId);
    if (index !== -1) {
      this.addendumData[index].document = undefined;
      this.addendumData[index].documentPath = '';
      this.addendumData[index].uploadAddEndNumsFlag = 2;
    }
  }

  editAddendum(index: number) {

    this.addEnudumDataModel = { ...this.addendumData[index] };
    if (this.addEnudumDataModel.document) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.EnumDocUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.target?.result as string);
      };
      reader.readAsDataURL(this.addEnudumDataModel.document);
    }
    this.selectedFileName = this.addEnudumDataModel.documentPath;
    this.modalTitle = 'Edit endum';
    this.addEnuDumModel?.show();
  }

  triggerendumSubmit(form: NgForm) {
    form.ngSubmit.emit();
  }

  onendumSubmit(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach(field => {
        const control = form.controls[field];
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.saveAddendum();
  }

  saveAddendum() {
    if (this.selectedFileName && this.selectedFile) {
      this.addEnudumDataModel.documentPath = this.selectedFileName;
      this.addEnudumDataModel.document = this.selectedFile;

      if (this.EnumDocUrl) this.addEnudumDataModel.documentUrl = this.EnumDocUrl;
    }

    if (this.addEnudumDataModel.title && this.addEnudumDataModel.location) {
      if (this.addEnudumDataModel.addendumId === 0) {
        this.addEnudumDataModel.addendumId = this.nextId++;
        this.addendumData.push({ ...this.addEnudumDataModel });
      } else {
        const index = this.addendumData.findIndex(
          item => item.addendumId === this.addEnudumDataModel.addendumId
        );
        if (index !== -1) {
          this.addendumData[index] = { ...this.addEnudumDataModel };
        }
      }
      this.resetForm();
      this.addEnuDumModel?.hide();
    }
  }

  resetForm() {
    if (this.projectendumForm) {
      this.projectendumForm.resetForm();
      this.addEnudumDataModel = new AddEnudumModel();
      this.selectedFileName = null;
    }
  }

  removeAddendum(index: number) {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      buttons: ['No', 'Yes'],
      dangerMode: true,
    }).then(willDelete => {
      if (willDelete) {
        this.addendumData.splice(index, 1);
      } else {
        swal('Cancelled', 'Your record is safe :)', 'error');
      }
    });
  }

  triggerFormSubmit(form: NgForm) {
    form.ngSubmit.emit();
  }

  validateClientId(value: number): boolean {
    return value === 0;
  }

  validateNatureType(value: number): boolean {
    return value === 0;
  }

  validateStatus(value: number): boolean {
    return value === 0;
  }

  onSubmit(form: NgForm) {
    this.profilePicRequired = !this.projectDataModel.profilePicPath; 

    if (this.validateClientId(form.value.clientId)) {
      form.controls['clientId'].setErrors({ nonZero: true });
      return;
    }

    if (this.validateNatureType(form.value.projectNatureType)) {
      form.controls['projectNatureType'].setErrors({ nonZero: true });
      return;
    }

    if (this.validateStatus(form.value.projectStatus)) {
      form.controls['projectStatus'].setErrors({ nonZero: true });
      return;
    }

    if (form.invalid || this.profilePicRequired) {
      Object.keys(form.controls).forEach(field => {
        const control = form.controls[field];
        control?.markAsTouched({ onlySelf: true });
      });

      if (this.profilePicRequired) {
        const profileInfoElement = this.elRef.nativeElement.querySelector('.profile-info');
        if (profileInfoElement) {
          this.renderer.addClass(profileInfoElement, 'profile-error');
        }
      }

      return;
    }

    this.onInsert();
  }

  async onInsert() {
    const formData = new FormData();
    formData.append('Id', this.projectDataModel.id.toString());
    formData.append('ClientId', this.projectDataModel.clientId);
    formData.append('Name', this.projectDataModel.name);
    formData.append('Description', this.projectDataModel.description);
    formData.append('SubLocation', this.projectDataModel.subLocation);
    for (let i = 0; i < this.projectDataModel.serviceWindowsValue.length; i++) {
      const element = this.projectDataModel.serviceWindowsValue[i];
      formData.append(`serviceWindowsValue[${i}]`, this.projectDataModel.serviceWindowsValue[i]);
    }
    formData.append('LabourLICNumber', this.projectDataModel.labourLICNumber);

    formData.append("ProjectNatureType", this.projectDataModel.projectNatureType != null ? this.projectDataModel.projectNatureType.toString() : '');
    formData.append("GSTIN", this.projectDataModel.gstin);

    formData.append("ServiceCharge", this.projectDataModel.serviceCharge != null ? this.projectDataModel.serviceCharge.toString() : '0  ');
    formData.append("ProjectDeliveryModelType", this.projectDataModel.projectDeliveryModelType != null ? this.projectDataModel.projectDeliveryModelType.toString() : '');
    formData.append("ProjectResourceType", this.projectDataModel.projectResourceType != null ? this.projectDataModel.projectResourceType.toString() : '');
    formData.append("AttendanceType", this.projectDataModel.attendanceType != null ? this.projectDataModel.attendanceType.toString() : '');
    formData.append("PaymentType", this.projectDataModel.paymentType != null ? this.projectDataModel.paymentType.toString() : '');
    formData.append("PaymentCycleDays", this.projectDataModel.paymentCycleDays != null ? this.projectDataModel.paymentCycleDays.toString() : '');
    formData.append("ProjectStatus", this.projectDataModel.projectStatus != null ? this.projectDataModel.projectStatus.toString() : '');
    formData.append("ProjectResourceRequirement", this.projectDataModel.projectResourceRequirement != null ? this.projectDataModel.projectResourceRequirement.toString() : '');
    formData.append("BankName", this.projectDataModel.bankName);
    formData.append("ProjectManager", this.projectDataModel.projectManager != null ? this.projectDataModel.projectManager.toString() : '');
    formData.append("Leader1", this.projectDataModel.leader1 != null ? this.projectDataModel.leader1.toString() : '');
    formData.append("Leader2", this.projectDataModel.leader2 != null ? this.projectDataModel.leader2.toString() : '');
    formData.append("UploadDocumentFlag", this.UploadFlag.toString());

    const startDate = new Date(this.projectDataModel.startDate);
    const endDate = new Date(this.projectDataModel.endDate);

    const startDateISO = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString();
    const endDateISO = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString()

    formData.append("StartDate", startDateISO);
    formData.append("EndDate", endDateISO);

    if (
      this.projectDataModel.profilePicFile &&
      this.projectDataModel.profilePicFile instanceof File
    ) {
      formData.append('ProfilePic', this.projectDataModel.profilePicFile);
    } else {
      formData.append('ProfilePic', '');
    }
    this.addendumData.forEach((addendum, index) => {
      formData.append(`ProjectAddendums[${index}].addendumId`, addendum.addendumId.toString());
      formData.append(`ProjectAddendums[${index}].Description`, addendum.description);
      formData.append(`ProjectAddendums[${index}].Title`, addendum.title);
      formData.append(`ProjectAddendums[${index}].location`, addendum.location);
      if (addendum.document) {
        formData.append(`ProjectAddendums[${index}].document`, addendum.document);
        formData.append(`ProjectAddendums[${index}].documentName`, addendum.documentPath);
      } else {
        formData.append(`ProjectAddendums[${index}].document`, '');
      }
      formData.append(`ProjectAddendums[${index}].uploadAddEndNumsFlag`, addendum.uploadAddEndNumsFlag.toString());

    });

    if (this.projectDataModel.id === 0) {
      (
        await this.projectService.postFormProject(formData, `${AppConstant.POST_PROJECT}`)).subscribe({
          next: (response) => {
            if (response && response.success) {
              this.headerDropdownService.updateDropdown(1);

              this.toaster.success(response.message);
              this.totalCount += 1;
              this.projectDataModel = new ProjectDaum();
              this.router.navigate(["/project"]);
              this.basicLayoutComponent.callHeaderMethodFromProject();
            }
          }
        });
    } else {
      let params = new HttpParams().set("id", this.projectDataModel.id.toString());
      (await this.projectService.PutFormProject(formData, `${AppConstant.PUT_PROJECT}/${this.projectDataModel.id}`)).subscribe({
        next: (response) => {
          if (response && response.success) {
            this.headerDropdownService.updateDropdown(1);

            GlobalConfiguration.consoleLog('Project Master', 'On Update response', response);
            this.toaster.success(response.message);
            this.projectDataModel = new ProjectDaum();
            this.router.navigate(['/project']);
          }
        }
      });
    }
  }


  onGstinInput(gstinControl: any) {
    if (gstinControl.errors?.['pattern']) {
      this.GSTvalidate();
    }
  }

  GSTvalidate() {
    const requiredValidElements = this.elRef.nativeElement.querySelectorAll('.GSTValidate');
    if (requiredValidElements) {
      requiredValidElements.forEach((element: HTMLElement) => {
        if (element.classList.contains('mt-2')) {
          this.renderer.removeClass(element, 'mt-2');
          this.renderer.addClass(element, 'mt-4');
        }
      });
    }
  }
  onCancel() {
    this.router.navigate(['/project']);
  }
}
