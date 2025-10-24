import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToasterService } from "../../../../../common/toaster-service";
import { EmployeeService } from "../../../../../domain/services/employee.service";
import { AppConstant } from "../../../../../common/app-constant";
import { FileHandle } from "../../../../../directive/dragDrop.directive";
import swal from "sweetalert";
import {
  DocumentData,
  DocumentType,
} from "../../../../../domain/models/employee.model";

@Component({
  selector: "app-documents",
  templateUrl: "./documents.component.html",
  styleUrl: "./documents.component.scss",
})
export class DocumentsComponent implements OnInit {
  @ViewChild("AddFinacialDetailsModel", { static: false })
  public addFinacialDetailsModel: ModalDirective | undefined;
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;
  @Input() employeeId: number = 0;
  @Input() showTitle = true;

  @Output() financeCount = new EventEmitter<number>();
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);

  documentForm!: FormGroup;
  documentData: DocumentData[] = [];
  Bank: any;
  selectedtype = 3;
  documentType = [
    {
      name: "Bank Details",
    },
    {
      name: "Pan Card",
    },
    {
      name: "Aadhar Card",
    },
  ];

  accountType = [
    {
      name: "SAVING",
    },
    {
      name: "CURRENT",
    },
  ];
  UploadFlag: number = 3;
  //For File
  files: FileHandle[] = [];
  documentTypeList: DocumentType[] = [];
  baseImageURL = AppConstant.BASE_IMAGEURL + "uploads/";

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private toaster: ToasterService,
    private employeeService: EmployeeService,
  ) { }

  ngOnInit() {
    this.documentForm = this.fb.group({
      id: [""],
      documentType: [this.selectedtype, Validators.required],
      documentName: ["", Validators.required],
      attachmentFile: ["", Validators.required],
      profilePicPath: [""],
    });
    this.getDocumentData();
    this.GetDocumentType();
  }

  async GetDocumentType() {
    await this.employeeService
      .getEmployee<DocumentType[]>(AppConstant.GET_ALL_DOCUMENT)
      .subscribe({
        next: (response) => {
          this.documentTypeList = response.data;
        },
      });
  }

  async submit() {
    if (!this.documentForm.get("attachmentFile")?.value) {
      this.toaster.errorToaster(
        "Please select a file before submitting.",
        "File Required"
      );
      return; // Stop the submission
    }
    if (this.documentForm.valid) {
      if (this.documentForm.valid) {
        let data = this.documentForm.value;
        let formData = new FormData();
        formData.append("EmployeeId", this.employeeId.toString());
        formData.append("DocumentType", data.documentType);
        formData.append("DocumentName", data.documentName);
        formData.append("DocumentPath", data.attachmentFile);
        formData.append("UploadFlag", this.UploadFlag.toString());


        if (data.id == 0 || data.id == null) {
          await this.employeeService
            .postEmployee<DocumentData>(
              AppConstant.GET_EMPLOYEEBYID + "/EmployeeDocument",
              formData
            )
            .subscribe({
              next: (response) => {
                if (response.status == 200 && response.status) {
                  this.toaster.successToaster(response.message);
                  this.closeDocument();
                  this.documentForm.reset();
                  this.getDocumentData();
                } else {
                  this.toaster.errorToaster(response.message);
                }
              },
            });
        } else {
          formData.append("Id", data.id);
          await this.employeeService
            .putEmployee<DocumentData>(
              AppConstant.GET_EMPLOYEEBYID + "/EmployeeDocument",
              formData
            )
            .subscribe({
              next: (response) => {
                if (response.status == 200 && response.status) {
                  this.toaster.successToaster(response.message);
                  this.closeDocument();
                  this.documentForm.reset();
                  this.getDocumentData();
                } else {
                  this.toaster.errorToaster(response.message);
                }
              },
            });
        }
      }
    }
  }
  onTypeChange(event: any) {
    this.selectedtype = event.value;
    this.addValidation(this.selectedtype);
  }

  addValidation(type: any) {
    const numberControl = this.documentForm.get("number");

    if (type === 3) {
      numberControl?.setValidators([
        Validators.required,
        Validators.pattern("^[0-9]{9,18}$"),
      ]); // Example for 9 to 18 digits
    } else if (type === 2) {
      numberControl?.setValidators([
        Validators.required,
        Validators.pattern("^[A-Z]{5}[0-9]{4}[A-Z]{1}$"),
      ]);
    } else if (type === 1) {
      numberControl?.setValidators([
        Validators.required,
        Validators.pattern("^[0-9]{12}$"),
      ]);
    }
    numberControl?.updateValueAndValidity();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes["employeeId"]) {
      this.getDocumentData();
    }
  }
  async getDocumentData() {
    if (this.employeeId > 0) {
      await this.employeeService
        .getEmployee<DocumentData[]>(
          AppConstant.GET_EMPLOYEEBYID +
          "/" +
          this.employeeId +
          "/EmployeeDocument"
        )
        .subscribe({
          next: (response) => {
            this.documentData = response.data;
            this.documentData = response.data.map((document) => {
              const Data: DocumentData = {
                ...document,
                attachmentURL:
                  AppConstant.BASE_IMAGEURL +
                  "uploads/" +
                  document.documentPath,
              };
              return Data;
            });
          },
        });
    }
  }

  addDocument() {
    this.files = [];
    this.formDirective.resetForm();
    this.documentForm.reset();
    this.addFinacialDetailsModel?.show();
  }

  closeDocument() {
    this.formDirective.resetForm();
    this.documentForm.reset();
    this.files = [];
    this.addFinacialDetailsModel?.hide();
  }

  filesDropped(files: FileHandle[]): void {
    this.files = files;
    this.documentForm.patchValue({
      attachmentFile: this.files[0].file,
    });
    this.UploadFlag = 1;

  }

  handleFileSizeErrors(errors: string[]) {
    errors.forEach(error => {
      this.toaster.errorToaster(error);
    });
  }


  triggerProfileFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
    this.UploadFlag = 1;

  }

  onDocumentFileSelected(event: Event) {
    this.UploadFlag = 1;

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {

      if (file.size > AppConstant.FILE5MB) {
        this.toaster.errorToaster(`File "${file.name}" exceeds the size limit of 5MB.`);
      } else {
        this.files = [];

        const url = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        );
        const name = file.name;
        if (
          file.name.endsWith(".jpg") ||
          file.name.endsWith(".jpeg") ||
          file.name.endsWith(".png")
        ) {
          this.files.push({ file, url, name });
          this.documentForm.patchValue({
            attachmentFile: file,
          });
        } else {
          this.toaster.warningToaster("We allow only JPG, JPEG and PNG file!!");
        }
      }
    }
  }

  removeFile() {
    this.UploadFlag = 2;
    this.files = [];
    this.documentForm.get("attachmentFile")?.setValue(null);
  }

  editDoc(item: DocumentData) {
    if (item.documentPath != null) {
      let documentname = AppConstant.getActualFileName(item.documentPath);
      this.files = [];
      this.files.push({
        url: this.baseImageURL + item.documentPath,
        name: (documentname?.split(/[/\\]/).pop() || "") as string,
      });
    }
    this.addValidation(item.documentTypeId);
    this.selectedtype = item.documentTypeId;
    this.documentForm.patchValue({
      id: item.id,
      documentType: item.documentType,
      documentName: item.documentName,
      attachmentFile: item.documentPath,
      documentPath: item.documentPath,
    });
    this.addFinacialDetailsModel?.show();
    this.UploadFlag = 3;
  }

  async deleteDoc(item: DocumentData) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await this.employeeService
          .deleteEmployee<DocumentData>(
            AppConstant.GET_EMPLOYEEBYID + "/EmployeeDocument/" + item.id
          )
          .subscribe({
            next: (response) => {
              if (response.success && response.status === 200) {
                this.toaster.successToaster(response.message);
                this.getDocumentData();
              } else {
                this.toaster.warningToaster(response.message);
              }
            },
          });
      } else {
        return;
      }
    });
  }

  viewDocument(item: any) {
    AppConstant.getDownloadFile(item.documentPath)
  }
}
