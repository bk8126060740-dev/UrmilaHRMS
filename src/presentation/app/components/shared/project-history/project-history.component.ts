import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToasterService } from '../../../../../common/toaster-service';
import { ProjectHistoryService } from '../../../../../domain/services/projecthistory.service';
import { getProjectNameModel, ProjectHistoryDetails } from '../../../../../domain/models/projecthistory.model';
import { AppConstant } from '../../../../../common/app-constant';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { JwtService } from '../../../../../common/jwtService.service';
import swal from "sweetalert";
import { HttpParams } from '@angular/common/http';
import { LocalStorageService } from '../../../../../common/local-storage.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-project-history',
  templateUrl: './project-history.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './project-history.component.scss'
})

export class ProjectHistoryComponent {
  @Input() employeeId: number = 0;
  projecthistoryForm!: FormGroup;
  @ViewChild("addProjectHistory", { static: false }) public addProjectHistory:
    | ModalDirective
    | undefined;
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;
  projectDetails: ProjectHistoryDetails[] = [];
  getprojectname: getProjectNameModel[] = [];
  submitted = false;
  minEndDate: Date | null = null;
  todayDate: Date | null = null;
  projectId: number = 0;
  @Input() isEmployed = true;
  totalCount: number = 0;
  pageNumber: number = 1;
  recode: number = 10;
  searchTerm: string = '';
  filterTerm: string = '';
  orderby: string = '';
  @Input() showTitle = false;
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);
  isEditMode: boolean = false;
  currentMonthStart!: Date;
  currentMonthEnd!: Date;

  constructor(private fb: FormBuilder,
    private ProjectServices: ProjectHistoryService,
    private toaster: ToasterService,
    private datePipe: DatePipe,
    private jwtService: JwtService,
    private localStorageService: LocalStorageService,
  ) {
  }

  ngOnInit(): void {
    this.projecthistoryForm = this.fb.group({
      id: [''],
      projectName: ["", Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      role: ["", Validators.required]
    });
    if (this.employeeId > 0) {
      this.getProjectDetails();
    }
    this.getprojectName();
  }

  addSalarySlip() {
    this.addProjectHistory?.show();
  }

  addProjectHistorys() {
    this.submitted = false;
    this.isEditMode = false;
    this.formDirective.resetForm();
    this.projecthistoryForm.reset();

    // Enable fields in add mode
    this.projecthistoryForm.get('projectName')?.enable();
    this.projecthistoryForm.get('startDate')?.enable();
    this.projecthistoryForm.get('role')?.enable();
    this.projecthistoryForm.get('endDate')?.clearValidators();
    this.projecthistoryForm.get('endDate')?.updateValueAndValidity();

    this.addProjectHistory?.show();
  }

  endDateValidator(control: any) {
    const startDate = this.projecthistoryForm?.get("startDate")?.value;
    const endDate = control.value;
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return { endDateBeforeStartDate: true };
    }
    return null;
  }

  onStartDateChange(event: MatDatepickerInputEvent<Date>) {
    const startDate = event.value;
    if (startDate) {
      this.minEndDate = new Date(startDate);
      // Reset the end date if it is before the start date
      if (new Date(this.projecthistoryForm.get("endDate")?.value) < this.minEndDate) {
        this.projecthistoryForm.get("endDate")?.setValue(null);
      }
    }
  }

  async getProjectDetails() {
    let params = new HttpParams()
      .set("employeeId ", this.employeeId.toString())
      .set("RecordCount", this.recode.toString())
      .set("PageNumber", this.pageNumber.toString())
      .set("FilterBy", this.searchTerm)
      .set("OrderBy", this.orderby);
    if (this.employeeId > 0) {
      await this.ProjectServices.getAllProjectHistory<ProjectHistoryDetails[]>(AppConstant.GET_EMPLOYEEBYID + '/' + this.employeeId + '/ProjectHistory', params).subscribe({
        next: (response) => {
          this.projectDetails = response.data;
          this.projectDetails = response.data.map((project) => {
            if (project.endDate != null) {
              const projecthistoryData: ProjectHistoryDetails = {
                ...project, startDate: new Date(project.startDate), endDate: new Date(project.endDate),
                formattedStartDate: this.datePipe.transform(new Date(project.startDate), "dd/MM/yyyy") || undefined,
                formattedEndDate: this.datePipe.transform(new Date(project.endDate), "dd/MM/yyyy") || undefined,
              };
              return projecthistoryData;
            } else {
              if (project.startDate != null) {
                const experienceData: ProjectHistoryDetails = {
                  ...project,
                  startDate: new Date(project.startDate),
                  formattedStartDate: this.datePipe.transform(new Date(project.startDate), "dd/MM/yyyy") || undefined,
                  formattedEndDate: undefined,
                };
                return experienceData;
              } else {
                const experienceData: ProjectHistoryDetails = {
                  ...project,
                  formattedStartDate: undefined,
                  formattedEndDate: undefined,
                };
                return experienceData;
              }
            }
          });
        }
      })
    }
  }

  onSubmit() {
    this.submitted = true;
    const form = this.projecthistoryForm;

    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control?.markAsTouched();
    });

    if (this.isEditMode) {
      const startDate = form.get('startDate')?.value;
      const endDateControl = form.get('endDate');
      const endDate = endDateControl?.value;

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (!endDate) {
        endDateControl?.setErrors({ required: true });
      } else if (end < start) {
        endDateControl?.setErrors({ endBeforeStart: true });
      } else {
        endDateControl?.setErrors(null);
      }
    }

    form.updateValueAndValidity();

    if (form.invalid) {
      return;
    }
    this.submitproject();
  }

  async submitproject() {
    const data = this.projecthistoryForm.getRawValue();

    const isValidDate = (date: any) =>
      date != null && date !== '' && !isNaN(new Date(date).getTime());

    const obj = {
      employeeId: +this.employeeId,
      projectId: +data.projectName,
      startDate: new Date(data.startDate).toISOString(),
      endDate: isValidDate(data.endDate) ? new Date(data.endDate).toISOString() : null,
      role: data.role
    };

    try {

      let response;

      if (!data.id) {
        response = await firstValueFrom(
          this.ProjectServices.postProjectHistory<ProjectHistoryDetails>(
            AppConstant.GET_EMPLOYEEBYID + '/ProjectHistory',
            obj
          )
        );
      } else {
        const employeeId = this.employeeId;
        const projectHistoryId = data.id;

        const putUrl = `${AppConstant.GET_EMPLOYEEBYID}/${employeeId}/ProjectHistory/${projectHistoryId}`;

        const putObj = { ...obj, id: +data.id };

        response = await firstValueFrom(
          this.ProjectServices.putProjectHistory<ProjectHistoryDetails>(
            putUrl,
            putObj
          )
        );
      }

      if (response.success) {
        this.toaster.successToaster(response.message);
        this.getProjectDetails();
        this.addProjectHistory?.hide();
      } else {
        this.toaster.errorToaster(response.message);
      }
    } catch (error) {
      this.toaster.errorToaster('An error occurred while submitting the project history.');
    }
  }


  async getprojectName() {
    this.ProjectServices.getAllProjectHistory<any[]>(AppConstant.GET_PROJECT + '/GetListOfIdAndName')
      .subscribe({
        next: (response) => {
          let allProjects = response.data;
          const storedProjectName = this.localStorageService.getItem(AppConstant.PROJECTNAME);

          if (storedProjectName) {
            const matchedProject = allProjects.find(
              p => p.name?.toLowerCase() === storedProjectName.toLowerCase()
            );

            if (matchedProject) {
              this.projecthistoryForm.get('projectName')?.setValue(matchedProject.id);
              allProjects = allProjects.filter(p => p.id !== matchedProject.id);
            }
          }
          this.getprojectname = allProjects;
        }
      });
  }

  deleteProjectHistory(item: ProjectHistoryDetails) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete: any) => {
      if (willDelete) {
        this.ProjectServices.deleteProjectHistory<ProjectHistoryDetails>(AppConstant.GET_EMPLOYEEBYID + '/ProjectHistory' + '/' + item.id).subscribe({
          next: (response) => {
            if (response.success && response.status === 200) {
              this.toaster.successToaster(response.message);
              this.getProjectDetails();
            } else {
              this.toaster.warningToaster(response.message);
            }
          },
        });
      }
    });
  }

  editableProjectName: string = '';
  editProjectHistory(item: ProjectHistoryDetails) {
    this.isEditMode = true;
    this.currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    this.projecthistoryForm.patchValue({
      id: item.id,
      projectName: item.projectId,
      startDate: new Date(item.startDate),
      endDate: item.endDate ? new Date(item.endDate) : null,
      role: item.role
    });
    this.editableProjectName = item.projectName;
    this.projecthistoryForm.get('projectName')?.disable();
    this.projecthistoryForm.get('startDate')?.disable();
    this.projecthistoryForm.get('role')?.disable();

    const endDateControl = this.projecthistoryForm.get('endDate');

    this.addProjectHistory?.show();
  }

  endDateValidatorInEditMode() {
    return (control: import('@angular/forms').AbstractControl) => {
      if (!this.isEditMode) return null;

      const startDate = this.projecthistoryForm?.get('startDate')?.value;
      const endDate = control.value;

      if (!endDate) {
        return { required: true };
      }

      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        return { endDateBeforeStartDate: true };
      }

      return null;
    };
  }

  private convertToDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/');
    return new Date(+year, +month - 1, +day);
  }

  onCloseModalProjectHistory(): void {
    this.projecthistoryForm.reset();
    this.formDirective.resetForm();
    this.addProjectHistory?.hide();
    this.submitted = false;
  }

}
