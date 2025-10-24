import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { AppConstant } from "../../../../../../common/app-constant";
import { Daum } from "../../../../../../domain/models/codeType.model";
import { codeDaum } from "../../../../../../domain/models/code.model";
import { ModalDirective } from "ngx-bootstrap/modal";
import { CodeTypeService } from "../../../../../../domain/services/codeType.service";
import { ToastrService } from "ngx-toastr";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { CandidateService } from "../../../../../../domain/services/candidate.service";
import { BulkOfferSent, Candidate, CandidateSalaryBreakdown, HROfferSent, OfferStatus, ProjectStatus, Status, } from "../../../../../../domain/models/candidate.model";
import { DatePipe } from "@angular/common";
import { CodeService } from "../../../../../../domain/services/code.service";
import { HttpParams } from "@angular/common/http";
import { NavigationExtras, Router } from "@angular/router";
import { HeaderDropdownService } from "../../../../../../domain/services/header-dropdown.service";
import swal from "sweetalert";
import { ToasterService } from "../../../../../../common/toaster-service";
import { GrantPermissionService } from "../../../../../../domain/services/permission/is-granted.service";
import { LocalStorageService } from "../../../../../../common/local-storage.service";
import { ExportService } from "../../../../../../domain/services/export.service";

@Component({
  selector: "app-job-application",
  templateUrl: "./job-application.component.html",

  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./job-application.component.scss"], // Fixed 'styleUrl' to 'styleUrls'
})
export class JobApplicationComponent implements OnInit {
  @ViewChild("bulkmodel") public codeModel: ModalDirective | undefined;
  @ViewChild("bulkOfferSentModel") public bulkOfferSentModal: | ModalDirective | undefined;
  @ViewChild("codeTypeForm") public codeTypeForm: NgForm | undefined; // Assuming you have a form reference

  bulkOfferSentForm!: FormGroup;

  rowData: Candidate[] = [];
  selectedRowData: Candidate[] = [];
  totalCount = 0;
  title = "Process Application";
  columns = [
    {
      field: "jobTitle",
      displayName: "Job Name",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "name",
      displayName: "Name",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "mobileNumber",
      displayName: "Mobile Number",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "email",
      displayName: "E-Mail",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },

    {
      field: "formattedTdoj",
      displayName: "TDOJ",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    {
      field: "referralEmpName",
      displayName: "Referral Name",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    //   field: "preferanceName",
    //   displayName: "Contact Pref.",
    //   sortable: true,
    //   filterable: true,
    //   visible: true,
    //   fixVisible: true,
    {
      field: "status",
      displayName: "Status",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
      statusDropdown: true,
      isCenter: true,
    },
  ];
  codeTypeDataModel: codeDaum = new codeDaum();
  candidateStatus: ProjectStatus[] = [];
  defualtSelectedStatus: ProjectStatus = new ProjectStatus();
  statusCount: number = 0;
  selectedStatus: ProjectStatus = new ProjectStatus();
  recode: number = 10;
  searchTerm: string = "";
  orderby: string = "";
  dropdownList: Status[] = [];
  pageNumber: number = 1;
  changeRowData: Candidate = new Candidate();
  newStatus: any;
  generatedOfferLetterPath: string = 'https://urmilaemsblobstorage.blob.core.windows.net/nirghosh-ems-docs-dev/contents%5Ccandidate%5C2%5C638827503359868831_OfferLetter.pdf?sv=2025-01-05&se=2025-05-14T05%3A39%3A35Z&sr=b&sp=r&sig=x4uei6rbj2I611JvYrw7%2Fx8wIj6o0DHrYQ9bspCrrBg%3D';
  candidateSalaryBreakdown: CandidateSalaryBreakdown[] = [];

  @ViewChild("hroffersentModel", { static: false }) public hroffersentModel: | ModalDirective | undefined;
  @ViewChild("offerLetterResultModal", { static: false }) public offerLetterResultModal: | ModalDirective | undefined;
  @ViewChild("offerstatusModel", { static: false }) public offerstatusModel: | ModalDirective | undefined; @ViewChild("onboardingStartedModel", { static: false })
  public onboardingStartedModel: ModalDirective | undefined;

  offerSentForm!: FormGroup;
  offerStatusForm!: FormGroup;
  onboardingStartedForm!: FormGroup;
  dropdownSubscription: any;
  constructor(
    private candidateService: CandidateService,
    private toaster: ToasterService,
    private router: Router,
    private datePipe: DatePipe,
    private codeService: CodeService,
    private headerDropdownService: HeaderDropdownService,
    private fb: FormBuilder,
    private grantPermissionService: GrantPermissionService,
    private localStorageService: LocalStorageService,
    private exportService: ExportService,
  ) {
    // initialize the bulk offer sent form
    this.bulkOfferSentForm = this.fb.group({
      ctc: ["", Validators.required],
    });

    // initialise the offer sent form
    this.offerSentForm = this.fb.group({
      CandidateId: [""],
      basicSalaryMonthly: ["", Validators.required],
      basicSalaryYearly: [{ value: "", disabled: true }],
      hraMonthly: ["", Validators.required],
      hraYearly: [{ value: "", disabled: true }],
      conveyanceAllowanceMonthly: ["", Validators.required],
      conveyanceAllowanceYearly: [{ value: "", disabled: true }],
      grossSalaryMonthly: ["", Validators.required],
      grossSalaryYearly: [{ value: "", disabled: true }],
      employerPFMonthly: ["", Validators.required],
      employerPFYearly: [{ value: "", disabled: true }],
      employerESICMonthly: ["", Validators.required],
      employerESICYearly: [{ value: "", disabled: true }],
      employeePFMonthly: ["", Validators.required],
      employeePFYearly: [{ value: "", disabled: true }],
      employeeESICMonthly: ["", Validators.required],
      employeeESICYearly: [{ value: "", disabled: true }],
      medicalInsuranceMonthly: ["", Validators.required],
      medicalInsuranceYearly: [{ value: "", disabled: true }],
      netInHandMonthly: ["", Validators.required],
      netInHandYearly: [{ value: "", disabled: true }],
      totalCostCompanyMonthly: ["", Validators.required],
      totalCostCompanyYearly: [{ value: "", disabled: true }]
    });
    this.offerStatusForm = this.fb.group({
      ctc: ["", Validators.required],
      comments: [""],
      offeredCTC: [{ value: "", disabled: true }, [Validators.required]],
      candidateId: ["", Validators.required],
    });
    this.onboardingStartedForm = this.fb.group({
      candidateId: ["", Validators.required],
      doj: ["", Validators.required],
      comments: [""],
      hiringManagerId: ["", Validators.required],
    });
  }
  ngOnInit(): void {
    this.dropdownSubscription = this.headerDropdownService.dropdownValue$.subscribe((value) => {
      const project = this.localStorageService.getItem(AppConstant.PROJECTID);

      if (value != project) {
        this.getAllCandidate();
      }
    });
    this.getAllCandidate();

    // Add value change listeners for monthly fields to update yearly fields
    this.offerSentForm.get('basicSalaryMonthly')?.valueChanges.subscribe((monthly) => {
      this.offerSentForm.get('basicSalaryYearly')?.setValue(this.calcYearly(monthly), { emitEvent: false });
    });
    this.offerSentForm.get('hraMonthly')?.valueChanges.subscribe((monthly) => {
      this.offerSentForm.get('hraYearly')?.setValue(this.calcYearly(monthly), { emitEvent: false });
    });
    this.offerSentForm.get('conveyanceAllowanceMonthly')?.valueChanges.subscribe((monthly) => {
      this.offerSentForm.get('conveyanceAllowanceYearly')?.setValue(this.calcYearly(monthly), { emitEvent: false });
    });
    this.offerSentForm.get('grossSalaryMonthly')?.valueChanges.subscribe((monthly) => {
      this.offerSentForm.get('grossSalaryYearly')?.setValue(this.calcYearly(monthly), { emitEvent: false });
    });
    this.offerSentForm.get('employerPFMonthly')?.valueChanges.subscribe((monthly) => {
      this.offerSentForm.get('employerPFYearly')?.setValue(this.calcYearly(monthly), { emitEvent: false });
    });
    this.offerSentForm.get('employerESICMonthly')?.valueChanges.subscribe((monthly) => {
      this.offerSentForm.get('employerESICYearly')?.setValue(this.calcYearly(monthly), { emitEvent: false });
    });
    this.offerSentForm.get('employeePFMonthly')?.valueChanges.subscribe((monthly) => {
      this.offerSentForm.get('employeePFYearly')?.setValue(this.calcYearly(monthly), { emitEvent: false });
    });
    this.offerSentForm.get('employeeESICMonthly')?.valueChanges.subscribe((monthly) => {
      this.offerSentForm.get('employeeESICYearly')?.setValue(this.calcYearly(monthly), { emitEvent: false });
    });
    this.offerSentForm.get('medicalInsuranceMonthly')?.valueChanges.subscribe((monthly) => {
      this.offerSentForm.get('medicalInsuranceYearly')?.setValue(this.calcYearly(monthly), { emitEvent: false });
    });
    this.offerSentForm.get('netInHandMonthly')?.valueChanges.subscribe((monthly) => {
      this.offerSentForm.get('netInHandYearly')?.setValue(this.calcYearly(monthly), { emitEvent: false });
    });
    this.offerSentForm.get('totalCostCompanyMonthly')?.valueChanges.subscribe((monthly) => {
      this.offerSentForm.get('totalCostCompanyYearly')?.setValue(this.calcYearly(monthly), { emitEvent: false });
    });
  }

  calcYearly(monthly: number): string {
    if (monthly !== null && monthly !== undefined && !isNaN(monthly)) {
      return (monthly * 12).toFixed(2);
    }
    return '';
  }

  ngOnDestroy() {
    if (this.dropdownSubscription) {
      this.dropdownSubscription.unsubscribe();
    }
  }

  async getCandidateStatus() {
    await this.candidateService.getCandidate<Status[]>(AppConstant.CANDIDATE + '/Status').subscribe({
      next: (response) => {
        this.dropdownList = response.data;
      }
    });

  }

  async onBulkOfferSentData(event: any) {
    (await this.grantPermissionService.hasSpecialPermission("Write", 41)).subscribe({
      next: (response) => {
        if (response) {
          this.selectedRowData = event;
          const ids = this.selectedRowData.map(({ id }) => {
            return id;
          });
          this.bulkOfferSentModal?.show();
        } else {
          this.toaster.warningToaster(AppConstant.NOTPERMISSION);
        }
      }
    })

  }

  onBulkOfferSent() {
    const ids = this.selectedRowData.map(({ id }) => {
      return id;
    });
    const obj: BulkOfferSent = {
      ctc: this.bulkOfferSentForm.get("ctc")?.value,
      candidates: ids,
    };
    console.log("request object", this.selectedRowData, "request body", obj);
    if (this.bulkOfferSentForm.invalid) {
      return;
    }
    this.candidateService.postCandidate<BulkOfferSent>(AppConstant.CANDIDATE + "/BulkOfferSent", obj).subscribe({
      next: (response) => {
        console.log(response);
        this.bulkOfferSentModal?.hide();
        this.toaster.successToaster(response.message);
        this.getAllCandidate();
      },
      error: (error) => {
        this.bulkOfferSentModal?.hide();
        this.getAllCandidate();
      },
    });
  }

  async onOfferSent(candidate: Candidate) {
    this.changeRowData = candidate;
    this.offerSentForm.patchValue({
      CandidateId: candidate.id
    });
    if (this.offerSentForm.valid) {

      let formData = new FormData();
      const data = this.offerSentForm.value;

      formData.append("CandidateId", candidate.id.toString());
      formData.append('BasicSalary', data.basicSalaryMonthly);
      formData.append('HRA', data.hraMonthly);
      formData.append('ConveyanceAllowance', data.conveyanceAllowanceMonthly);
      formData.append('GrossSalary', data.grossSalaryMonthly);
      formData.append('EmployerPF', data.employerPFMonthly);
      formData.append('EmployerESIC', data.employerESICMonthly);
      formData.append('EmployeePF', data.employeePFMonthly);
      formData.append('EmployeeESIC', data.employeeESICMonthly);
      formData.append('MedicalInsurance', data.medicalInsuranceMonthly);
      formData.append('NetInHand', data.netInHandMonthly);
      formData.append('TotalCTC', data.totalCostCompanyMonthly);

      if (this.candidateSalaryBreakdown.length === 0) {
        await this.candidateService.postCandidate<CandidateSalaryBreakdown>(AppConstant.GET_OFFER_LETTER, formData).subscribe({
          next: (response) => {
            this.toaster.successToaster(response.message);
            this.hroffersentModel?.hide();
            setTimeout(() => {
              this.offerLetterResultModal?.show();

            }, 300);
            this.getCandidateAllData(candidate.id);
          }
        });
      }

    }
  }

  closeOfferLetterModal() {
    this.offerLetterResultModal?.hide();
    this.offerSentForm.reset();
  }
  closeOfferSendModel() {
    this.hroffersentModel?.hide();
    this.offerSentForm.reset();
  }

  deleteCandidateSalaryBreakdown() {
    this.candidateService.deleteCandidate<CandidateSalaryBreakdown>(AppConstant.GET_OFFER_LETTER + "/" + this.candidateSalaryBreakdown[0].id).subscribe({
      next: (response) => {
        this.toaster.successToaster(response.message);
        this.getCandidateAllData(this.candidateSalaryBreakdown[0].candidate.id);
        this.closeOfferLetterModal();
        this.closeOfferSendModel();

      }
    });
  }

  sendOffer() {
    let params = new HttpParams()
      .set('Candidate', this.changeRowData.id.toString())
      .set('CCMails[0]', this.localStorageService.getItem('emailId'));
    this.candidateService.post<Candidate>(AppConstant.GET_OFFER_LETTER + "/SendOfferLetter", params).subscribe({
      next: (response) => {
        this.toaster.successToaster(response.message);
        this.offerLetterResultModal?.hide();
      }
    });
  }

  rejectOffer() {
    let params = new HttpParams()
      .set('candidateId', this.changeRowData.id.toString());
    this.candidateService.deleteCandidate<Candidate>(AppConstant.GET_OFFER_LETTER + "/DeleteOfferLetter", params).subscribe({
      next: (response) => {
        this.toaster.successToaster(response.message);
        this.offerLetterResultModal?.hide();
        this.deleteCandidateSalaryBreakdown();
      }
    });
  }

  //     title: "Are you sure?",
  //     text: "You will not be able to recover this record!",
  //     icon: "warning",
  //     dangerMode: true,

  async deleteSalaryBreakdown() {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete: any) => {
      if (willDelete) {
        this.deleteOfferLatter();
      } else {
        return;
      }
    });
  }
  async deleteOfferLatter() {
    await this.candidateService.deleteCandidate<Candidate>(`${AppConstant.GET_OFFER_LETTER}/DeleteOfferLetter?candidateId=${this.candidateSalaryBreakdown[0].candidate.id}`).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.toaster.successToaster(response.message);
          this.getAllCandidate();
        }
      },
    });
  }

  updateSalaryBreakdown() {

  }

  async getCandidateAllData(candidateId: number) {
    await this.candidateService.getCandidate<CandidateSalaryBreakdown[]>(AppConstant.GET_OFFER_LETTER + '/Candidate/' + candidateId).subscribe({
      next: (response) => {
        if (response?.success && response?.data) {
          this.candidateSalaryBreakdown = response.data;
          const data = response.data[0];
          if (this.candidateSalaryBreakdown[0].candidate.filePath === '') {
            this.generatedOfferLetterPath = '';
          } else {
            this.generatedOfferLetterPath = this.candidateSalaryBreakdown[0].candidate.filePath;
            this.offerLetterResultModal?.show();
          }
          this.offerSentForm.patchValue({
            basicSalaryMonthly: data.basicSalary,
            basicSalaryYearly: data.basicSalary ? (data.basicSalary * 12).toFixed(2) : '',
            hraMonthly: data.hra,
            hraYearly: data.hra ? (data.hra * 12).toFixed(2) : '',
            conveyanceAllowanceMonthly: data.conveyanceAllowance,
            conveyanceAllowanceYearly: data.conveyanceAllowance ? (data.conveyanceAllowance * 12).toFixed(2) : '',
            grossSalaryMonthly: data.grossSalary,
            grossSalaryYearly: data.grossSalary ? (data.grossSalary * 12).toFixed(2) : '',
            employerPFMonthly: data.employerPF,
            employerPFYearly: data.employerPF ? (data.employerPF * 12).toFixed(2) : '',
            employerESICMonthly: data.employerESIC,
            employerESICYearly: data.employerESIC ? (data.employerESIC * 12).toFixed(2) : '',
            employeePFMonthly: data.employeePF,
            employeePFYearly: data.employeePF ? (data.employeePF * 12).toFixed(2) : '',
            employeeESICMonthly: data.employeeESIC,
            employeeESICYearly: data.employeeESIC ? (data.employeeESIC * 12).toFixed(2) : '',
            medicalInsuranceMonthly: data.medicalInsurance,
            medicalInsuranceYearly: data.medicalInsurance ? (data.medicalInsurance * 12).toFixed(2) : ''
          });
        }
      },
    });
  }

  async offerStatus(status: string) {
    let statusCode = status === "Accept" ? AppConstant.CANDIDATE_OFFER_ACCEPT : AppConstant.CANDIDATE_OFFER_REJECTED;
    let obj = {
      candidateId: this.offerStatusForm.get("candidateId")?.value,
      status: statusCode,
      ctc: this.offerStatusForm.get("offeredCTC")?.value,
      comments: this.offerStatusForm.get("comments")?.value,
    };
    await this.candidateService.postCandidate<OfferStatus>(AppConstant.CANDIDATE + "/OfferStatus", obj).subscribe({
      next: (reponse) => {
        this.offerStatusForm.patchValue({
          ctc: "",
          comments: "",
          offeredCTC: "",
          candidateId: "",
        });
        this.offerstatusModel?.hide();
        this.getAllCandidate();
        this.toaster.successToaster("Status Update Successfully!!");
      },
      error: (error) => {
        this.offerStatusForm.patchValue({
          ctc: "",
          comments: "",
          offeredCTC: "",
          candidateId: "",
        });
        this.offerstatusModel?.hide();
        this.getAllCandidate();
      },
    });
  }

  async sendOnboardLink() {
    let obj = {
      candidateId: this.onboardingStartedForm.get("candidateId")?.value,
      doj: this.onboardingStartedForm.get("doj")?.value.toISOString(),
      comments: this.onboardingStartedForm.get("comments")?.value,
      hiringManagerId: this.onboardingStartedForm.get("hiringManagerId")?.value,
    };
    await this.candidateService.postCandidate<OfferStatus>(AppConstant.CANDIDATE + "/OnboardingStarted", obj).subscribe({
      next: (reponse) => {
        this.onboardingStartedForm.reset();
        this.onboardingStartedModel?.hide();
        this.getAllCandidate();
        this.toaster.successToaster("OnBoard link send Successfully!!");
      },
      error: (error) => {
        this.getAllCandidate();
      },
    });
  }
  async onStatusCardClick(status: any) {
    status = this.candidateStatus.filter((item) => item.id === status);
    this.selectedStatus = status;
    if (status[0].name == "Total Records") {
      this.getAllCandidate();
    } else {
      this.searchTerm = `status eq ${status[0].id}`;
      await this.getAllCandidate();
      this.searchTerm = "";
    }
  }

  async changeToSortlisted(event: any) {
    let obj = {
      candidateId: event.row.id,
    };
    await this.candidateService.postCandidate<OfferStatus>(AppConstant.CANDIDATE + "/Shortlist", obj).subscribe({
      next: (reponse) => {

        this.getAllCandidate();
        this.toaster.successToaster("Candidate status changed successfully!");
      },
      error: (error) => {
        this.getAllCandidate();
      },
    });
  }

  async ondropdownChanges(event: any) {
    //
    let permission = false;
    (await this.grantPermissionService.hasSpecialPermission("Write", 37)).subscribe({
      next: (response) => {
        permission = response;
      }
    })
    if (permission) {
      console.log(event);
      this.changeRowData = event.row;
      this.newStatus = event.newStatus;
      if (event.newStatus === AppConstant.SORTLISTED) {
        swal({
          title: "Are you sure?",
          text: "Do you want to change the candidate status from Applied to Shortlisted?",
          icon: "warning",
          buttons: ["No", "Yes"],
          dangerMode: true,
        }).then((willDelete: any) => {
          if (willDelete) {
            this.changeToSortlisted(event);
          } else {
            return;
          }
        });
      } else if (event.newStatus === AppConstant.HR_OFFER_SENT) {
        this.offerSentForm.patchValue({
          email: this.changeRowData.email,
          candidateId: this.changeRowData.id,
        });
        this.hroffersentModel?.show();
        this.getCandidateAllData(this.changeRowData.id);
      } else if (event.newStatus === AppConstant.CANDIDATE_OFFER_ACCEPT || event.newStatus === AppConstant.CANDIDATE_OFFER_REJECTED) {
        this.offerstatusModel?.show();
        this.offerStatusForm.patchValue({
          offeredCTC: this.changeRowData.ctc,
          candidateId: this.changeRowData.id,
          ctc: this.changeRowData.ctc,
        });
      } else if (event.newStatus === AppConstant.ONBAORDING_STARTED) {
        this.onboardingStartedModel?.show();
        this.onboardingStartedForm.patchValue({
          candidateId: this.changeRowData.id,
          doj: this.changeRowData.tdoj,
          comments: "",
          hiringManagerId: 204,
        });
      } else if (event.newStatus === AppConstant.HIRING_MANAGER_APPROVED) {
        this.hiringManagerApproved();
      }
    } else {
      this.toaster.warningToaster(AppConstant.NOTPERMISSION);
      this.getAllCandidate();
    }

  }

  hiringManagerApproved() {
    swal({
      title: "Are you sure?",
      text: "you want to approve this candidate for the position?",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await this.candidateService.postCandidate<OfferStatus>(AppConstant.CANDIDATE + '/OnboardingHiringManagerApproved?candidateId=' + this.changeRowData.id).subscribe({
          next: (response) => {
            if (response.status == 200 && response.success) {

            } else {
              this.toaster.warningToaster('Something want wrong please try after some time.')
            }
          }
        })
      } else {
        return
      }
    });

  }

  getStatusColorCode(projectStatus: string): string {
    switch (projectStatus) {
      case 'Completed': return '#B77BEF';
      case 'In Progress': return '#F5B849';
      case 'On Hold': return '#ffa75d';
      case 'Cancel': return '#FA6060';
      case 'Closed': return ''; // Define color if needed
      case 'Hybrid Model': return '#F171B1';
      case 'Active': return '#59AAAA';
      default: return '#4285F4'; // Default color
    }
  }

  async getAllCandidate() {
    let params = new HttpParams()
      .set("RecordCount", this.recode.toString())
      .set("PageNumber", this.pageNumber.toString())
      .set("FilterBy", this.searchTerm)
      .set("OrderBy", this.orderby);

    await this.candidateService.getCandidate<Candidate[], ProjectStatus[]>(AppConstant.CANDIDATE, params).subscribe({
      next: (response) => {
        this.rowData = response.data.map((candidate) => {
          const candidateNewData: Candidate = {
            ...candidate,
            name:
              candidate.firstName +
              " " +
              candidate.midName +
              " " +
              candidate.lastName,
            tdoj: new Date(candidate.tdoj),
            formattedTdoj:
              this.datePipe.transform(
                new Date(candidate.tdoj),
                "dd/MM/yyyy"
              ) || undefined,
          };
          return candidateNewData;
        });

        console.log(this.rowData);

        if (response.candidateStatus) {
          this.totalCount = response.totalCount;
          const root = document.documentElement;
          const themeColor = getComputedStyle(root)
            .getPropertyValue("--theme-color")
            .trim();
          this.candidateStatus = [];
          this.defualtSelectedStatus = new ProjectStatus();
          this.defualtSelectedStatus.colorCode = themeColor;
          this.defualtSelectedStatus.count = response.statusCount;
          this.defualtSelectedStatus.id = 0;
          this.defualtSelectedStatus.name = "Total Records";

          this.candidateStatus.push(this.defualtSelectedStatus);
          this.statusCount = response.statusCount;
          response.candidateStatus.forEach((element) => {
            this.candidateStatus.push(element);
          });
          this.getCandidateStatus();
        }
      },
    });
  }

  addCodeType() {
    this.codeModel?.show();
  }

  onEdit(row: Candidate) {
    const navigationExtras: NavigationExtras = {
      state: {
        candidateData: row,
      },
    };
    this.router.navigate(["/recruitment/createcandidate"], navigationExtras);
  }

  closeModel() {
    this.codeModel?.hide();
  }

  onDelete(event: any) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete: any) => {
      if (willDelete) {
        this.deleteCandidate(event);
      } else {
        return;
      }
    });
  }
  async deleteCandidate(event: any) {
    await this.candidateService
      .deleteCandidate<Candidate>(AppConstant.CANDIDATE + "/" + event.id)
      .subscribe({
        next: (response) => {
          if (response && response.success) {
            this.toaster.successToaster("Delete ", response.message);
            this.getAllCandidate();
          }
        },
      });
  }

  insert() {
    this.router.navigate(["/recruitment/createcandidate"]);
  }

  onPageChange(event: any) {
    // Implement page change functionality
    this.pageNumber = event;
    this.getAllCandidate();
  }

  getCodeType() {
    // Implement the method to fetch code types
  }

  openModel() {
    this.codeModel?.show();
  }

  onTotalProjectPerPageValueChange(totalProjectCount: number) {
    this.recode = totalProjectCount;
    this.pageNumber = 1;
    this.getAllCandidate();
  }

  onSearch(search: string) {
    this.searchTerm = search;
    this.getAllCandidate();
  }
  orderBy(event: any) {
    event = event.replace(/formattedTdoj/g, "tdoj ");
    event = event.replace(/name/g, "firstName ");
    this.orderby = event;
    this.getAllCandidate();
  }

  export() {
    this.exportService.get(AppConstant.GET_EXPORT_CANDIDATE).subscribe({
      next: (response: Blob) => {
        this.downloadFile(response);
      },

    });
  }

  downloadFile(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "JobApplicationDetails_Export.xlsx"; // Specify the default file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

}
