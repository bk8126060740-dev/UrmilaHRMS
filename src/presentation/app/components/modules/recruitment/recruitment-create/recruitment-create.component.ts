import { jobPositionCreateRequestModel } from "./../../../../../../domain/models/jobPosition";
import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { ProjectService } from "../../../../../../domain/services/project.service";
import { AppConstant } from "../../../../../../common/app-constant";
import { GlobalConfiguration } from "../../../../../../common/global-configration";
import { Code, CodeType } from "../../../../../../domain/models/project.model";
import { ProjectDropdown } from "../../../../../../domain/models/recruitment.model";
import { RecruitmentService } from "../../../../../../domain/services/recruitment.service";
import { Editor, Toolbar } from "ngx-editor";
import {
  Department,
  HiringManager,
} from "./../../../../../../domain/models/jobPosition";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToasterService } from "../../../../../../common/toaster-service";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { HeaderDropdownService } from "../../../../../../domain/services/header-dropdown.service";
import { LocalStorageService } from "../../../../../../common/local-storage.service";
import { HttpParams } from "@angular/common/http";
import { Designation } from "../../../../../../domain/models/designation.model";
import { DesignationMasterService } from "../../../../../../domain/services/designation-master.service";

@Component({
  selector: "app-recruitment-create",
  templateUrl: "./recruitment-create.component.html",
  styleUrl: "./recruitment-create.component.scss",
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class RecruitmentCreateComponent implements OnInit, OnDestroy {
  validityFlag: boolean = false;
  jobPositionForm!: FormGroup;
  jobPositionResponse: Response = new Response();
  codeTypes: CodeType[] = [];
  projectDropdownData: ProjectDropdown[] = [];
  roleArray: Code[] = [];
  experienceTypeArray: Code[] = [];
  hiringManagerEmpArray: HiringManager[] = [];
  positionStatusArray: Code[] = [];
  modeArray: Code[] = [];
  languageArray: Code[] = [];
  qualificationArray: Code[] = [];
  skillArray: Code[] = [];
  skillsList: string[] = [];
  departmentArray: Department[] = [];
  editor: Editor;
  toolbar: Toolbar = [
    ["bold", "italic"],
    ["underline", "strike"],
    ["code", "blockquote"],
    ["ordered_list", "bullet_list"],
    [{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
    ["text_color", "background_color"],
    ["align_left", "align_center", "align_right", "align_justify"],
  ];
  designationList: Designation[] = [];
  searchText: string = "";
  selectedDesigantionId: number = 0;
  selectedDepartmentId: number = 0;
  isEditMode = false;


  today: Date = new Date();
  formattedStartDate: string = "";
  dropdownSubscription: any;
  constructor(
    private projectService: ProjectService,
    private recruitmentService: RecruitmentService,
    private fb: FormBuilder,
    private toaster: ToasterService,
    private router: Router,
    private headerDropdownService: HeaderDropdownService,
    private datePipe: DatePipe,
    private localStorageService: LocalStorageService,
    private designationService: DesignationMasterService
  ) {
    this.editor = new Editor();
    this.formattedStartDate =
      this.datePipe.transform(this.today, "dd-MM-yyyy") || "";
  }

  ngOnInit(): void {
    this.dropdownSubscription = this.headerDropdownService.dropdownValue$.subscribe((value) => {
      const project = this.localStorageService.getItem(AppConstant.PROJECTID);

      if (value != project) {
        this.router.navigate(['/recruitment/dashboard'])
      }
    });
    this.initForm();
    console.log("post form", this.jobPositionForm);
    const jobPositionEditData = history.state.jobPositionData;

    if (jobPositionEditData) {
      this.isEditMode = true;
      if (jobPositionEditData.languages) {
        jobPositionEditData.languages =
          jobPositionEditData.languages.split(",");
      }
      this.jobPositionForm.patchValue(jobPositionEditData);
      let id = jobPositionEditData.id;
      const url = AppConstant.JOB_POSITION + "/" + id;
      this.recruitmentService.getJobPositionById(url).subscribe(
        (response) => {
          this.onDesignationSearch(response.data.desgnationName)
          this.jobPositionForm.patchValue({
            designationId: response.data.desgnationId,
            departmentId: response.data.departmentId,
            description: response.data.description,
            qualifications: response.data.qualifications.map(
              (qualification) => qualification.qualificationName
            ),
            skills: response.data.skills.map((skill) => skill.skillName),
          });
          this.selectedDesigantionId = response.data.desgnationId;
          console.log(
            "populate form by Id",
            response.data,
            "form",
            this.jobPositionForm
          );
        },
        (err) => {
          console.log("error getting row data", err.message);
        }
      );
    }
    //
    this.getAllCodesByCodeTypesDropdownData();
    this.getDepartmentDropDownData();
    this.getHiringManagerData();
    this.jobPositionForm.get("startDate")?.valueChanges.subscribe((value) => {
      // Start date changed
    });

    this.getAllDesignation();
  }

  onDesignationSearch(term: string): void {
    this.searchText = term;
    this.getAllDesignation();
  }

  async getAllDesignation() {
    let httpParams = new HttpParams().set("SearchText", this.searchText);
    await this.designationService.getDesignationAllData<Designation[]>(AppConstant.DESIGNATION + '/Search', httpParams).subscribe({
      next: (response) => {
        this.designationList = response.data;
        if (!this.isEditMode) {
          this.jobPositionForm.get('designationId')?.reset();
        }
      }
    })
  }


  initForm() {
    this.jobPositionForm = this.fb.group({
      designationId: ["", [Validators.required]],
      title: ["", Validators.required],
      projectId: [{ value: null, disabled: true }, Validators.required],
      departmentId: ["", Validators.required],
      role: [""],
      noOfPosition: [
        0,
        [Validators.required, Validators.min(1), Validators.max(2000)],
      ],
      ctcMin: [
        "",
        [
          Validators.required,
          Validators.maxLength(2),
          Validators.min(0),
          Validators.max(80),
        ],
      ],
      ctcMax: [
        "",
        [
          Validators.required,
          Validators.maxLength(2),
          Validators.min(0),
          Validators.max(80),
        ],
      ],
      experienceTypeId: ["", Validators.required],
      experienceMin: [
        "",
        [
          Validators.required,
          Validators.min(0),
          Validators.max(99),
        ],
      ],
      experienceMax: [
        "",
        [
          Validators.required,
          Validators.min(0),
          Validators.max(99),
        ],
      ],
      hiringManagerEmployeeId: [null, Validators.required],
      status: [null, Validators.required],
      modeId: [undefined],
      startDate: [this.today],
      endDate: [this.today],
      location: ["", Validators.required],
      ageMin: [
        "",
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100)
        ],
      ],
      ageMax: [
        "",
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100),
        ],
      ],
      languages: ["", Validators.required],
      duration: [""],
      qualifications: [null, Validators.required],
      skills: ["", Validators.required],
      description: [""],
    });

    this.jobPositionForm.get("experienceMin")?.valueChanges.subscribe(() => {
      if (this.validityFlag) return;
      this.validityFlag = true;
      this.validityFlag = false;
      const experienceMaxControl = this.jobPositionForm.get("experienceMax");
      const experienceMinControl = this.jobPositionForm.get("experienceMin");

      experienceMaxControl?.setValidators([
        Validators.required,
        Validators.min(experienceMinControl?.value),
      ]);
      experienceMinControl?.markAsTouched();
      experienceMaxControl?.updateValueAndValidity();
    });

    this.jobPositionForm.get("experienceMax")?.valueChanges.subscribe(() => {
      if (this.validityFlag) return;
      this.validityFlag = true;
      const experienceMinControl = this.jobPositionForm.get("experienceMin");
      const experienceMaxControl = this.jobPositionForm.get("experienceMax");

      experienceMinControl?.setValidators([
        Validators.required,
        Validators.max(experienceMaxControl?.value),
      ]);
      experienceMaxControl?.markAsTouched();
      experienceMinControl?.updateValueAndValidity();
      this.validityFlag = false;
    });

    this.jobPositionForm.get("ageMin")?.valueChanges.subscribe(() => {
      if (this.validityFlag) return;
      this.validityFlag = true;
      const ageMaxControl = this.jobPositionForm.get("ageMax");
      const ageMinControl = this.jobPositionForm.get("ageMin");

      ageMaxControl?.setValidators([
        Validators.required,
        Validators.min(ageMinControl?.value),
      ]);
      ageMaxControl?.markAsTouched();
      ageMaxControl?.updateValueAndValidity();
      this.validityFlag = false;
    });

    this.jobPositionForm.get("ageMax")?.valueChanges.subscribe(() => {
      if (this.validityFlag) return;
      this.validityFlag = true;
      const ageMinControl = this.jobPositionForm.get("ageMin");
      const ageMaxControl = this.jobPositionForm.get("ageMax");

      ageMinControl?.setValidators([
        Validators.required,
        Validators.max(ageMaxControl?.value),
      ]);
      ageMinControl?.markAsTouched();
      ageMinControl?.updateValueAndValidity();
      this.validityFlag = false;
    });

    this.jobPositionForm.get("ctcMin")?.valueChanges.subscribe(() => {
      if (this.validityFlag) return;
      this.validityFlag = true;
      const ctcMaxControl = this.jobPositionForm.get("ctcMax");
      const ctcMinControl = this.jobPositionForm.get("ctcMin");

      ctcMaxControl?.setValidators([
        Validators.required,
        Validators.min(ctcMinControl?.value),
      ]);

      ctcMaxControl?.markAsTouched();
      ctcMaxControl?.updateValueAndValidity();
      this.validityFlag = false;
    });

    this.jobPositionForm.get("ctcMax")?.valueChanges.subscribe(() => {
      if (this.validityFlag) return;
      this.validityFlag = true;
      const ctcMinControl = this.jobPositionForm.get("ctcMin");
      const ctcMaxControl = this.jobPositionForm.get("ctcMax");

      ctcMinControl?.setValidators([
        Validators.required,
        Validators.max(ctcMaxControl?.value),
      ]);

      ctcMinControl?.markAsTouched();
      ctcMinControl?.updateValueAndValidity();
      this.validityFlag = false;
    });

  }

  limitDigitsMin(event: any) {
    const input = event.target;
    if (input.value.length > 2) {
      input.value = input.value.slice(0, 2);
    }
  }

  agelimitDigitsMin(event: any) {
    const input = event.target;
    if (input.value.length > 3) {
      input.value = input.value.slice(0, 3);
    }
  }

  async getAllCodesByCodeTypesDropdownData() {
    let obj = { codeTypeIds: AppConstant.JOB_CREATE_DROPDOWN };
    (
      await this.projectService.getAllCodesByCodeTypesDropdownData(
        obj,
        `${AppConstant.GET_ALLCODESBYCODETYPES}`
      )
    ).subscribe(
      (response) => {
        if (response) {
          GlobalConfiguration.consoleLog(
            "Recruitment Create Component",
            "Get All Dropdown Data Responce",
            response
          );

          this.codeTypes = response.data;
          for (var i = 0; i < this.codeTypes.length; i++) {
            if (this.codeTypes[i].name === "Role") {
              this.roleArray = this.codeTypes[i].codes;
            } else if (this.codeTypes[i].name === "Experience Type") {
              this.experienceTypeArray = this.codeTypes[i].codes;
            } else if (this.codeTypes[i].name === "Job Position Status") {
              this.positionStatusArray = this.codeTypes[i].codes;
            } else if (this.codeTypes[i].name === "Mode") {
              this.modeArray = this.codeTypes[i].codes;
            } else if (this.codeTypes[i].name === "Language") {
              this.languageArray = this.codeTypes[i].codes;
            } else if (this.codeTypes[i].name === "Qualification") {
              this.qualificationArray = this.codeTypes[i].codes;
            }
          }
        }
      },
      (error) => {
        GlobalConfiguration.consoleLog(
          "Recruitment Create Component",
          "Get All Dropdown Data Type Error",
          error
        );
      }
    );
  }

  //     .getProjectDropdownData(`${AppConstant.GET_PROJECTDROPDOWN}`)
  //     .subscribe(
  //             "*Project dropdown get Response",
  //             "response:",

  async getHiringManagerData() {
    let objLeader = {
      designations: []
    }
    await this.projectService.postEmployeeDropdownData(AppConstant.GET_EMPLOYEEBYID + "/GetListOfHoIdAndName", objLeader).subscribe({
      next: (response) => {
        if (response && response.success) {

          this.hiringManagerEmpArray = response.data;

        }
      }
    })
  }

  totalDepartmentCount: number = 10;
  isFirstTime: boolean = true;

  getDepartmentDropDownData() {
    const url = AppConstant.GET_DEPARTMENT_DROPDOWN;
    let params = new HttpParams()
      .set('RecordCount', this.totalDepartmentCount);
    this.recruitmentService.getDepartmentDropdownData(url, params).subscribe((response) => {
      if (response && response.success) {
        if (this.isFirstTime) {
          this.totalDepartmentCount = response.totalCount;
          this.isFirstTime = false;
          this.getDepartmentDropDownData();
        } else {
          this.departmentArray = response.data;
          if (!this.isEditMode) {
            this.jobPositionForm.get('departmentId')?.reset();
          }
        }
        console.log("Department dropdown", response.data);
      }
    });
  }

  postJobPosition() {
    const requestObject: any = {
      title: this.jobPositionForm.get("title")?.value,
      designationId: this.selectedDesigantionId.toString(),
      hiringManagerEmployeeId: this.jobPositionForm.get(
        "hiringManagerEmployeeId"
      )?.value,
      noOfPosition: this.jobPositionForm.get("noOfPosition")?.value,
      ctcMin: this.jobPositionForm.get("ctcMin")?.value,
      ctcMax: this.jobPositionForm.get("ctcMax")?.value,
      ectcMin: 0,
      ectcMax: 0,
      experienceTypeId: this.jobPositionForm.get("experienceTypeId")?.value,
      experienceMin: this.jobPositionForm.get("experienceMin")?.value,
      experienceMax: this.jobPositionForm.get("experienceMax")?.value,
      positionFilled: 0,
      status: this.jobPositionForm.get("status")?.value,
      description: this.jobPositionForm.get("description")?.value,
      location: this.jobPositionForm.get("location")?.value,
      ageMin: this.jobPositionForm.get("ageMin")?.value,
      ageMax: this.jobPositionForm.get("ageMax")?.value,
      languages: this.jobPositionForm.get("languages")?.value.toString(),
      note: "",
      departmentId: this.selectedDepartmentId.toString(),
      role: this.jobPositionForm.get("role")?.value,
      modeId: this.jobPositionForm.get("modeId")?.value,
      duration: this.jobPositionForm.get("duration")?.value === "" || this.jobPositionForm.get("duration")?.value === undefined || this.jobPositionForm.get("duration")?.value === null ? '' : this.jobPositionForm.get("duration")?.value.toString(),
      startDate: this.jobPositionForm.get("startDate")?.value,
      endDate: this.jobPositionForm.get("endDate")?.value,
      skills: this.jobPositionForm.get("skills")?.value.map((skill: string) => ({
        skillName: skill,
      })),
      qualifications: this.jobPositionForm.get("qualifications")?.value.map((qualification: any) => ({
        qualificationName: qualification,
        description: qualification.description || "",
      })),
    };

    const jobPositionEditData = history.state.jobPositionData; // as form is already updated in ngOnInit

    if (jobPositionEditData) {
      const qualificationsFromHistory = jobPositionEditData.qualifications;
      const skillsFromHistory = jobPositionEditData.skills;


      // GET THE DATA FROM THE ID THROUGH GET REQUEST AND THEN COMPARE THAT

      const url = AppConstant.JOB_POSITION + "/" + jobPositionEditData.id;
      this.recruitmentService.getJobPositionById(url).subscribe({
        next: (response) => {
          if (response.status === 200) {
            let getSkillsData = response.data.skills;
            let getQualificationsData = response.data.qualifications;
            requestObject.qualifications = requestObject.qualifications.map(
              (item: any) => {
                const matchingQualification = getQualificationsData.find((getQualificationsDataItem: any) =>
                  getQualificationsDataItem.qualificationName === item.qualificationName
                );
                if (matchingQualification) {
                  return {
                    ...item,
                    id: matchingQualification.id,
                  };
                }
                return item;
              }
            );

            requestObject.skills = requestObject.skills.map((item: any) => {
              const matchingSkill = getSkillsData.find((getSkillsDataItem: any) => getSkillsDataItem.skillName === item.skillName);
              if (matchingSkill) {
                return {
                  ...item,
                  id: matchingSkill.id,
                };
              }
              return item;
            });

            console.log("request object while updating", requestObject);

            const URL = AppConstant.JOB_POSITION + "/" + jobPositionEditData.id;
            this.recruitmentService.putJobPosition(URL, requestObject).subscribe({
              next: (response) => {
                if (response.status === 200) {
                  this.toaster.successToaster(response.message);
                  this.router.navigate(["/recruitment/dashboard"]);
                }
              }
            });
          }
        }
      });
    } else {
      const URL = AppConstant.JOB_POSITION;
      this.recruitmentService.postJobPosition(URL, requestObject).subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.toaster.successToaster(response.message);
            this.router.navigate(["/recruitment/dashboard"]);
          }
        }
      });
    }
  }

  submitJobPositionForm() {
    if (this.jobPositionForm.invalid) {
      this.jobPositionForm.markAllAsTouched();
      return;
    }
    console.log("form", this.jobPositionForm);
    this.postJobPosition();
  }

  triggerFormSubmit() {
    console.log("reactive form  triggered from btn", this.jobPositionForm);
    if (this.jobPositionForm.valid) {
      console.log("valid form so making http post request");
      this.submitJobPositionForm();
    }
    if (this.jobPositionForm.invalid) {
      console.log("invalid form");
      Object.keys(this.jobPositionForm.controls).forEach((field) => {
        const control = this.jobPositionForm.controls[field];
        control?.markAsTouched({ onlySelf: true });
      });
      console.log("invalid form");
      return;
    }
  }

  onDescriptionChange(event: Event) {
    // try to access content here
    console.log("event editor", event);
    this.jobPositionForm.get("description")?.setValue("1");
  }

  ngOnDestroy() {
    if (this.dropdownSubscription) {
      this.dropdownSubscription.unsubscribe();
    }
  }


  get f() {
    return this.jobPositionForm.controls;
  }

  cancelButttonHandler() {
    this.router.navigate(["/recruitment/dashboard"]);
  }

  onInputChange(event: Event): void {
    this.skillsList = (event.target as HTMLInputElement)?.value
      .split(",")
      .map((item) => {
        return item;
      });

    this.jobPositionForm.get("skills")?.setValue(this.skillsList);
  }
}
