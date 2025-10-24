import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ClientDaum, LeaderModel } from '../../../../../../domain/models/client.model';
import { ClientService } from '../../../../../../domain/services/client.service';
import { AppConstant } from '../../../../../../common/app-constant';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { clientState } from '../../../../../../common/state/state.state';
import { clearFormValue } from '../../../../../../common/state/state.action';
import { GlobalConfiguration } from '../../../../../../common/global-configration';
import { FormGroup, NgForm, FormBuilder, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert';
import { AddEnudumModel, Code } from '../../../../../../domain/models/project.model';
import { LocationServices } from '../../../../../../domain/services/location.service';
import { LocationData } from '../../../../../../domain/models/location.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GrantPermissionService } from '../../../../../../domain/services/permission/is-granted.service';

@Component({
  selector: 'app-client-create',
  templateUrl: './client-create.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './client-create.component.scss',
})
export class ClientCreateComponent implements OnInit {
  @ViewChild('clientModal', { static: false }) public clientModal: ModalDirective | undefined;
  @ViewChild("formDirective", { static: false }) formDirective!: NgForm;

  currentEditingIndex: number | undefined = undefined;
  uploadFlag: number = 3;    // for no changes, 1 for add and 2 for delete
  clientDataModel: ClientDaum = new ClientDaum();
  leaders: Code[] = [];
  assignedLeadersForClient: LeaderModel[] = [];
  leader1: LeaderModel = new LeaderModel();
  leader2: LeaderModel = new LeaderModel();
  leader3: LeaderModel = new LeaderModel();
  selectedFile: File | null = null;
  documentPath: string | null = null;
  fileSizeError: string | null = null;
  fileDownloadUrl: string = '';
  fileName: string | undefined;
  states: Code[] = [];
  stateData: LocationData[] = [];
  addendumData: string[] = [];
  addEnuDumModel: AddEnudumModel = new AddEnudumModel();
  addLeadersInClientForm!: FormGroup;
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);
  projectAttendanceTypeArray = [
    {
      id: 23,
      name: 'Bio-Metric',
      enumItem: 'Bio-Metric',
      isDefault: false,
    },
    {
      id: 24,
      name: 'Excel',
      enumItem: 'Excel',
      isDefault: false,
    },
    {
      id: 25,
      name: 'PDF',
      enumItem: 'PDF',
      isDefault: false,
    },
    {
      id: 26,
      name: 'Application',
      enumItem: 'Application',
      isDefault: false,
    },
  ];

  isUpdateable: boolean = false;
  isInsertable: boolean = false;

  UploadFlag: number = 3;


  constructor(
    private router: Router,
    private clientService: ClientService,
    private el: ElementRef,
    private renderer: Renderer2,
    private toaster: ToastrService,
    private store: Store<{ editForm: clientState }>,
    private locationService: LocationServices,
    private FormBuilder: FormBuilder,
    private grantPermissionService: GrantPermissionService
  ) { }

  ngOnInit() {

    this.initAddLeadersInClientForm();
    if (history.state.data != null || history.state.data != undefined) {
      this.clientDataModel = history.state.data;
      this.assignedLeadersForClient = this.clientDataModel.clientLeaders;

      this.documentPath = (history.state.data.documentPath?.split(/[/\\]/).pop() || '') as string;
      if (history.state.data.documentPath) {
        this.getDownloadFile(this.documentPath);
        this.UploadFlag = 3;
      }
    }
    this.getAllCodesByCodeTypesDropdown();
    this.getAllState();
  }

  callPermissionCheck(permission: string) {
    this.grantPermissionService.hasPermission(permission).subscribe({
      next: (response) => {
        permission === 'Update' ? this.isUpdateable = response : ''
        permission === 'Write' ? this.isInsertable = response : ''

      }
    })
  }

  initAddLeadersInClientForm() {
    this.addLeadersInClientForm = this.FormBuilder.group({
      name: ['', Validators.required],
      designation: ['', [Validators.required]],
      email: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      leaderLevel: ['', Validators.required],
    });
  }

  async getAllState() {
    await this.locationService.getState(AppConstant.GET_STATE).subscribe({
      next: response => {
        this.stateData = response.data;
      },
    });
  }
  createClient() {
    let formData = new FormData();
    formData.append('name', this.clientDataModel.name);
    formData.append('address', this.clientDataModel.address);
    formData.append('gstinOrUIN', this.clientDataModel.gstinOrUIN);
    if (this.clientDataModel.panOrIT != null && this.clientDataModel.panOrIT != undefined && this.clientDataModel.panOrIT.trim() != '') {
      formData.append('panOrIT', this.clientDataModel.panOrIT);
    }
    formData.append('StateId', this.clientDataModel.stateId.toString());
    formData.append('TANNumber', this.clientDataModel.tanNumber);
    formData.append('email', this.clientDataModel.email == null ? '' : this.clientDataModel.email);
    formData.append('contactNumber', this.clientDataModel.contactNumber == null ? '' : this.clientDataModel.contactNumber);
    formData.append('description', this.clientDataModel.description);
    formData.append("UploadFlag", this.UploadFlag.toString());

    this.assignedLeadersForClient.forEach((element, index) => {
      formData.append(`ClientLeaders[${index}].leaderLevel`, element.leaderLevel.toString());
      formData.append(`ClientLeaders[${index}].name`, element.name);
      formData.append(`ClientLeaders[${index}].designation`, element.designation);
      formData.append(`ClientLeaders[${index}].email`, element.email);
      formData.append(`ClientLeaders[${index}].contactNumber`, element.contactNumber);
    });


    if (this.selectedFile) {
      formData.append('document', this.selectedFile);
    }

    formData.append('UploadFlag', this.uploadFlag.toString())



    // Form data preparation completed


    if (this.clientDataModel.id == 0) {
      this.clientService.postFormClient(`${AppConstant.POST_CLIENT}`, formData).subscribe({
        next: response => {
          if (response.success === true) {
            this.toaster.success(response.message);
            this.clientDataModel = new ClientDaum();
            this.router.navigate(['/client']);
          }
        },
        error: error => {
          GlobalConfiguration.consoleLog('In client create component', 'Create client error', error);
        },
      });
    } else {
      formData.append('id', this.clientDataModel.id.toString());
      // make document path null 
      this.documentPath = null
      // Updating form data for edit
      this.uploadFlag = 2
      this.clientService.putFormClient(`${AppConstant.PUT_CLIENT}/${this.clientDataModel.id.toString()}`, formData).subscribe({
        next: response => {
          if (response && response.success) {
            this.toaster.success(response.message);
            this.clientDataModel = new ClientDaum();
            this.router.navigate(['/client']);
          }
        },
        error: error => {
          GlobalConfiguration.consoleLog('In client create component', 'Edit client error', error);
        },
      });
      this.store.dispatch(clearFormValue());
    }
  }

  getFileFromInput(file: any) {
    if (file.target.files.length > 0) {
      this.uploadFlag = 1

      this.selectedFile = null;
      this.fileName = '';
      const tempFile = file.target.files[0];
      console.log('uploaded file', tempFile)
      const maxSizeInBytesForPdf = 5242880; // 5MB for PDF
      const maxSizeInBytesForDoc = 3145728; // 3MB for DOC/DOCX
      const maxSizeInBytesForImage = 2097152; // 2MB for Images (PNG, JPG, JPEG)

      // Clear any previous error
      this.fileSizeError = '';

      // Validate the selected file
      const fileName = tempFile.name.toLowerCase();

      if (fileName.includes('.pdf') && tempFile.size <= maxSizeInBytesForPdf) {
        this.selectedFile = tempFile;
        this.UploadFlag = 1;
      } else if ((fileName.includes('.doc') || fileName.includes('.docx')) && tempFile.size <= maxSizeInBytesForDoc) {
        this.selectedFile = tempFile;
        this.UploadFlag = 1;
      } else if ((fileName.includes('.png') || fileName.includes('.jpg') || fileName.includes('.jpeg')) && tempFile.size <= maxSizeInBytesForImage) {
        this.selectedFile = tempFile;
        this.UploadFlag = 1;
      } else {
        this.selectedFile = null;
        this.fileSizeError = 'Select a PDF file less than 5MB, a DOC/DOCX file less than 3MB, or an Image file (PNG, JPG, JPEG) less than 2MB.';
      }
    }
  }

  removefile() {
    this.uploadFlag = 2;
    this.selectedFile = null;
    this.fileName = '';
    this.UploadFlag = 2;
    this.fileDownloadUrl = "";
    const fileInput = document.getElementById('inputFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Reset the file input value
    }
  }

  cancleCreate(clientForm: any) {
    if (clientForm.dirty) {
      swal({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        buttons: ['No', 'Yes'],
        dangerMode: true,
      }).then(willDelete => {
        if (willDelete) {
          this.router.navigate(['/client']);
        } else {
          return;
        }
      });
    } else {
      this.router.navigate(['/client']);
    }
  }

  triggerFormSubmit(form: NgForm) {
    this.onSubmit(form);
    console.log('submitting the form', form);
  }

  validateStateId(value: number): boolean {
    return value === 0;
  }

  onSubmit(form: NgForm) {
    if (this.validateStateId(form.value.stateId)) {
      form.controls['stateId'].setErrors({ nonZero: true });
      return;
    }
    if (form.invalid) {
      Object.keys(form.controls).forEach(field => {
        const control = form.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.createClient();
  }

  getDownloadFile(path: any) {
    if (path) {
      this.fileDownloadUrl = history.state.data.documentPath;
      this.fileName = history.state.data.documentPath;
    } else {
      this.fileDownloadUrl = '';
    }
  }

  DownloadFile() {
    AppConstant.getDownloadFile(this.fileDownloadUrl);
  }

  getAllCodesByCodeTypesDropdown() {
    let obj = {
      codeTypeIds: AppConstant.GET_CLIENTSTATE,
    };
    this.clientService.getAllCodesByCodeTypesDropdownData(obj, `${AppConstant.GET_ALLCODESBYCODETYPES}`).subscribe({
      next: response => {
        if (response && response.success) {
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].name === 'State') {
              this.states = response.data[i].codes;
            }
            if (response.data[i].name === 'Client Type Level') {
              this.leaders = response.data[i].codes;
              console.log('leaders', this.leaders);
            }
          }
        }
      },
      error: error => {
        console.log('Error getting codeTypes:', error);
      },
    });
  }

  onGstinInput(gstinControl: any) {
    if (gstinControl.errors?.['pattern']) {
      this.GSTvalidate();
    }
  }

  uploadAttendance() {
    this.router.navigate(['/attendance/dashboard']);
  }

  GSTvalidate() {
    const requiredValidElements = this.el.nativeElement.querySelectorAll('.GSTValidate');
    if (requiredValidElements) {
      requiredValidElements.forEach((element: HTMLElement) => {
        if (element.classList.contains('mt-2')) {
          this.renderer.removeClass(element, 'mt-2');
          this.renderer.addClass(element, 'mt-4');
        }
      });
    }
  }

  onPANinInput(panIt: any) {
    if (panIt.errors?.['pattern']) {
      this.PANvalidate();
    }
  }

  PANvalidate() {
    const requiredValidElements = this.el.nativeElement.querySelectorAll('.PANValidate');
    if (requiredValidElements) {
      requiredValidElements.forEach((element: HTMLElement) => {
        if (element.classList.contains('mt-2')) {
          this.renderer.removeClass(element, 'mt-2');
          this.renderer.addClass(element, 'mt-4');
        }
      });
    }
  }

  addEndum() {
    console.log('add end um');
    this.clientModal?.show();
  }

  editLeader(index: number) {
    const leaderToEdit = this.assignedLeadersForClient[index];

    this.addLeadersInClientForm.patchValue({
      leaderLevel: leaderToEdit.leaderLevel,
      leaderLevelName: leaderToEdit.leaderLevelName,
      name: leaderToEdit.name,
      email: leaderToEdit.email,
      designation: leaderToEdit.designation,
      contactNumber: leaderToEdit.contactNumber,
    });

    this.currentEditingIndex = index;
    this.clientModal?.show();
  }

  deleteLeader(index: number) {
    this.assignedLeadersForClient.splice(index, 1);
  }

  AddLeader() {
    if (this.addLeadersInClientForm.invalid) return;

    const updatedLeader: LeaderModel = {
      leaderLevel: this.addLeadersInClientForm.get('leaderLevel')?.value,
      leaderLevelName: this.addLeadersInClientForm.get('leaderLevelName')?.value || '',
      name: this.addLeadersInClientForm.get('name')?.value,
      email: this.addLeadersInClientForm.get('email')?.value,
      designation: this.addLeadersInClientForm.get('designation')?.value,
      contactNumber: this.addLeadersInClientForm.get('contactNumber')?.value,
    } as LeaderModel;

    if (this.currentEditingIndex !== undefined && this.currentEditingIndex >= 0) {
      this.assignedLeadersForClient[this.currentEditingIndex] = updatedLeader;
      this.addLeadersInClientForm.patchValue({
        leaderLevel: '',
        leaderLevelName: '',
        name: '',
        email: '',
        designation: '',
        contactNumber: '',
      });
    } else {
      this.assignedLeadersForClient.push(updatedLeader);
    }

    this.closeLeader();
  }

  addLeader() {
    this.formDirective.resetForm();
    this.clientModal?.show()
  }

  closeLeader() {
    this.formDirective.resetForm();
    this.clientModal?.hide();
    this.addLeadersInClientForm.reset();
    this.addLeadersInClientForm.markAsPristine();
    this.addLeadersInClientForm.markAsUntouched();
    this.currentEditingIndex = undefined;
  }
}
