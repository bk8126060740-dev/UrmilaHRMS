import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FileHandle } from "../../../../../directive/dragDrop.directive";
import { LocationServices } from "../../../../../domain/services/location.service";
import { AppConstant } from "../../../../../common/app-constant";
import { LocationData } from "../../../../../domain/models/location.model";
import { HttpParams } from "@angular/common/http";
import { EmployeeService } from "../../../../../domain/services/employee.service";
import { EmployeeAddrssData } from "../../../../../domain/models/employee.model";
import { CandidateService } from "../../../../../domain/services/candidate.service";
import { CandidateAddrssData } from "../../../../../domain/models/candidate.model";

@Component({
  selector: "app-address",
  templateUrl: "./address.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrl: "./address.component.scss",
})
export class AddressComponent {
  addressForm!: FormGroup;
  stateData: LocationData[] = [];
  cityData: LocationData[] = [];
  parmentCityData: LocationData[] = [];
  address: EmployeeAddrssData = new EmployeeAddrssData();

  constructor(
    private fb: FormBuilder,
    private locationService: LocationServices,
    private employeeService: EmployeeService,
    private candidateService: CandidateService
  ) { }

  @Output() formSubmit = new EventEmitter<FormGroup>();
  @Output() isFormValid = new EventEmitter<boolean>();
  @Input() employeeId: number = 0;
  @Input() isEmployed: boolean = true;
  @Input() userTypeId: number = 3;

  files: FileHandle[] = [];

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      communicationAddress: this.fb.group({
        id: [""],
        employeeId: [this.employeeId, Validators.required],
        addressLine1: ["", Validators.required],
        addressLine2: [""],
        landmark: [""],
        zipCode: ["", [Validators.required, Validators.pattern(/^\d{6}$/)]],
        cityId: ["", Validators.required],
        stateId: ["", Validators.required],
        country: [""],
        addressType: [0],
        candidateId: [this.employeeId, Validators.required],
      }),
      permanentAddress: this.fb.group({
        id: [""],
        employeeId: [this.employeeId, Validators.required],
        addressLine1: ["", Validators.required],
        addressLine2: [""],
        landmark: [""],
        zipCode: ["", [Validators.required, Validators.pattern(/^\d{6}$/)]],
        cityId: ["", Validators.required],
        stateId: ["", Validators.required],
        country: [""],
        addressType: [0],
        candidateId: [this.employeeId, Validators.required],
      }),
      sameAddress: [false],
    });

    this.addressForm.valueChanges.subscribe(async () => {
      if (this.addressForm.get("sameAddress")?.value) {
        // Get the current permanent address id
        const permanentAddressId = this.addressForm.get(
          "permanentAddress.id"
        )?.value;

        // Copy communication address to permanent address, but keep the permanent address `id`
        const communicationAddress = {
          ...this.addressForm.get("communicationAddress")?.value,
        };

        // Set the permanent address `id` back to the original one
        communicationAddress.id = permanentAddressId;
        communicationAddress.addressType = 83;
        this.addressForm
          .get("permanentAddress")
          ?.patchValue(communicationAddress, { emitEvent: false });
      }
      this.emitFormData();
    });

    this.getStateList();
    this.getAddress();
  }

  async getAddress() {
    if (this.isEmployed) {
      if (this.employeeId > 0) {
        if (this.userTypeId >= 3) {
          await this.employeeService.getEmployee<EmployeeAddrssData>(AppConstant.GET_EMPLOYEEBYID + "/" + this.employeeId + "/Addresses").subscribe({
            next: async (response) => {
              this.address = response.data;
              if (this.address.communicationAddress.stateId != null) {
                if (this.address.communicationAddress.stateId > 0) {
                  await this.getCityList(this.address.communicationAddress.stateId, "comunication");
                  await this.getCityList(this.address.permanentAddress.stateId, "parmemnet");
                }
              }
              this.bindData();
            },
          });
        } else if (this.userTypeId === 1) {
          await this.candidateService.getCandidate<EmployeeAddrssData>(AppConstant.CANDIDATE + "/" + this.employeeId + "/Addresses").subscribe({
            next: async (response) => {
              this.address = response.data;
              if (this.address.communicationAddress.stateId != null) {
                if (this.address.communicationAddress.stateId > 0) {
                  await this.getCityList(this.address.communicationAddress.stateId, "comunication");
                  await this.getCityList(this.address.permanentAddress.stateId, "parmemnet");
                }
              }

              this.bindData();
            },
          });
        }
      }
    } else {
      if (this.employeeId > 0) {
        await this.candidateService.getCandidate<EmployeeAddrssData>(AppConstant.CANDIDATE + "/" + this.employeeId + "/Addresses").subscribe({
          next: async (response) => {
            this.address = response.data;
            if (this.address.communicationAddress.stateId != null) {
              if (this.address.communicationAddress.stateId > 0) {
                await this.getCityList(this.address.communicationAddress.stateId, "comunication");
                await this.getCityList(this.address.permanentAddress.stateId, "parmemnet");
              }
            }

            this.bindData();
          },
        });
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["employeeId"]) {
      this.getAddress();
    }
  }

  bindData() {
    this.addressForm.get("communicationAddress")?.patchValue(
      {
        id: this.address.communicationAddress.id,
        employeeId: this.isEmployed ? this.address.communicationAddress.employeeId ? this.address.communicationAddress.employeeId : this.address.communicationAddress.candidateId : this.address.communicationAddress.candidateId,
        candidateId: this.isEmployed ? this.address.communicationAddress.employeeId ? this.address.communicationAddress.employeeId : this.address.communicationAddress.candidateId : this.address.communicationAddress.candidateId,
        addressLine1: this.address.communicationAddress.addressLine1,
        addressLine2: this.address.communicationAddress.addressLine2,
        landmark: this.address.communicationAddress.landmark,
        zipCode: this.isEmployed ? this.address.communicationAddress.zipCode ? this.address.communicationAddress.zipCode : this.address.communicationAddress.postalCode : this.address.communicationAddress.postalCode,
        cityId: this.address.communicationAddress.stateId ? this.address.communicationAddress.cityId : null,
        stateId: this.address.communicationAddress.stateId,
        country: this.address.communicationAddress.country,
        addressType: this.address.communicationAddress.addressType,
      },
      { emitEvent: false }
    );
    this.addressForm.get("permanentAddress")?.patchValue({
      id: this.address.permanentAddress.id,
      employeeId: this.isEmployed ? this.address.permanentAddress.employeeId ? this.address.communicationAddress.employeeId : this.address.communicationAddress.candidateId : this.address.permanentAddress.candidateId,
      candidateId: this.isEmployed ? this.address.permanentAddress.employeeId ? this.address.permanentAddress.employeeId : this.address.permanentAddress.candidateId : this.address.permanentAddress.candidateId,
      addressLine1: this.address.permanentAddress.addressLine1,
      addressLine2: this.address.permanentAddress.addressLine2,
      landmark: this.address.permanentAddress.landmark,
      zipCode: this.isEmployed ? this.address.permanentAddress.zipCode ? this.address.permanentAddress.zipCode : this.address.permanentAddress.postalCode : this.address.permanentAddress.postalCode,
      cityId: this.address.permanentAddress.stateId ? this.address.permanentAddress.cityId : null,
      stateId: this.address.permanentAddress.stateId,
      country: this.address.permanentAddress.country,
      addressType: this.address.permanentAddress.addressType,
    });
  }

  async getStateList() {
    await this.locationService.getState(AppConstant.GET_STATE).subscribe({
      next: (response) => {
        this.stateData = response.data;
      },
    });
  }
  async onStateChange(event: any, from: any) {
    let selectedState = event.value;
    await this.getCityList(selectedState, from);
    if (this.addressForm.get("sameAddress")?.value) {
      await this.getCityList(selectedState, "parmemnet");
    }
  }

  async getCityList(stateId: any, from: any) {
    let params = new HttpParams().set("StateId", stateId);
    await this.locationService.getCity(AppConstant.GET_CITY, params).subscribe({
      next: (response) => {
        if (from === "comunication") {
          this.cityData = response.data;
        } else {
          this.parmentCityData = response.data;
        }
      },
    });
  }

  public emitFormData() {
    this.formSubmit.emit(this.addressForm.value);
    this.isFormValid.emit(this.addressForm.valid);
  }

  clickNext() {
    // 
    this.formSubmit.emit(this.addressForm.value);
    this.isFormValid.emit(this.addressForm.valid);
    this.addressForm.markAllAsTouched();
  }

  onSubmit() {
    if (this.addressForm.valid) {

    } else {

    }
  }
  async onCheckboxChange(event: any) {
    if (event.checked) {
      // Copy communication address to permanent address
      await this.getCityList(
        this.address.communicationAddress.stateId,
        "parmemnet"
      );

      const permanentAddressId = this.addressForm.get(
        "permanentAddress.id"
      )?.value;

      // Copy communication address to permanent address, but keep the permanent address `id`
      const communicationAddress = {
        ...this.addressForm.get("communicationAddress")?.value,
      };

      // Set the permanent address `id` back to the original one
      communicationAddress.id = permanentAddressId;
      communicationAddress.addressType = 83;

      this.addressForm
        .get("permanentAddress")
        ?.patchValue(communicationAddress, { emitEvent: false });
    } else {
      const permanentAddressId = this.addressForm.get(
        "permanentAddress.id"
      )?.value;

      // Reset permanent address if unchecked
      this.addressForm.get("permanentAddress")?.reset();
      this.addressForm.get("permanentAddress")?.patchValue({
        id: permanentAddressId,
      });
    }
  }

  filesDropped(files: FileHandle[]): void {
    this.files = files;
  }

  triggerProfileFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }
}
