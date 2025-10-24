import { Component, OnInit, ViewChild } from '@angular/core';
import { DesignationMasterService } from '../../../../../../domain/services/designation-master.service';
import { Designation } from '../../../../../../domain/models/designation.model';
import { AppConstant } from '../../../../../../common/app-constant';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToasterService } from '../../../../../../common/toaster-service';
import swal from 'sweetalert';
import { debounceTime, switchMap, catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { BaseResponse } from '../../../../../../domain/models/base.model';

@Component({
  selector: 'app-designation-master',
  templateUrl: './designation-master.component.html',
  styleUrl: './designation-master.component.scss'
})
export class DesignationMasterComponent implements OnInit {

  totalCount: number = 0;
  recode: number = 10;
  orderby: string = "";
  pageNumber: number = 1;
  searchTerm: string = "";
  rowData: Designation[] = [];
  columns = [
    {
      field: "name",
      displayName: "Name",
      sortable: true,
      filterable: true,
      visible: true,
      fixVisible: true,
    },
    //   field: "isActive",
    //   displayName: "isActive",
    //   sortable: true,
    //   filterable: true,
    //   visible: true,
    //   fixVisible: true,
    //   field: "isDefault",
    //   displayName: "Default",
    //   visible: true,
    //   isSwitch: true,
    //   sortable: true,
    //   field: "isActive",
    //   displayName: "Status",
    //   visible: true,
    //   isSwitch: true,
    //   sortable: true
  ];
  designationName: string = "";
  designationId: number = 0;
  @ViewChild("designationModel") public designationModel: ModalDirective | undefined;
  @ViewChild("designationForm", { static: false }) designationForm!: NgForm;
  designationMstForm!: FormGroup;
  filteredSuggestions$: Observable<string[]> | undefined;
  nameControl = new FormControl('', Validators.required);

  constructor(private designationService: DesignationMasterService,
    private fb: FormBuilder,
    private toasterService: ToasterService,
    private http: HttpClient
  ) {

  }
  ngOnInit(): void {
    this.designationMstForm = this.fb.group({
      name: this.nameControl
    });

    // Fetch suggestions from API as user types
    this.filteredSuggestions$ = this.nameControl.valueChanges.pipe(
      debounceTime(300), // Wait 300ms after the user stops typing
      switchMap(value => (value ? this.fetchSuggestions(value) : of([])))
    );

    this.getDesignation();
  }

  fetchSuggestions(query: string): Observable<string[]> {
    const apiUrl = AppConstant.BASE_URL + AppConstant.DESIGNATION + '/Search?SearchText=' + query; // Replace with your API URL
    return this.http.get<BaseResponse<Designation[]>>(apiUrl).pipe(
      map(response => response.data.map(item => item.name)), // Extract names from API response
      catchError(() => of([])) // Return an empty array on error
    );
  }

  getDesignation() {
    let params = new HttpParams()
      .set("RecordCount", this.recode)
      .set("PageNumber", this.pageNumber)
      .set("FilterBy", this.searchTerm)
      .set("OrderBy", this.orderby);
    this.designationService.getDesignationAllData<Designation[]>(AppConstant.DESIGNATION, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.rowData = response.data;
          this.totalCount = response.totalCount;
        } else {
          this.rowData = [];
          this.totalCount = 0;
        }
      }
    })
  }

  onSubmit() {
    if (this.designationMstForm.valid) {
      if (this.designationId === 0) {
        let obj = {
          "name": this.designationMstForm.value.name,
          "level": 1,
          "isActive": true
        }
        this.designationService.postDesignationMaster<Designation>(obj, AppConstant.DESIGNATION).subscribe({
          next: (response) => {
            if (response.success) {
              this.toasterService.successToaster(response.message);
              this.closeModel();
              this.getDesignation();
            }
          }
        })
      } else {
        let obj = {
          "id": this.designationId,
          "name": this.designationMstForm.value.name,
          "level": 1,
          "isActive": true
        }
        this.designationService.putDesignationMaster<Designation>(obj, AppConstant.DESIGNATION + '/' + this.designationId).subscribe({
          next: (response) => {
            if (response.success) {
              this.toasterService.successToaster(response.message);
              this.closeModel();
              this.getDesignation();

            }
          }
        })
      }
    }
  }

  onEdit(event: any) {
    this.designationId = event.id;
    this.designationMstForm.patchValue({
      name: event.name
    })
    this.designationModel?.show();
  }

  onDelete(event: any) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await this.designationService.deleteReporting<Designation>(`${AppConstant.DESIGNATION}/${event.id}`).subscribe({
          next: (response) => {
            if (response && response.success) {
              this.toasterService.successToaster(response.message);
              this.getDesignation();
            }
          }
        });
      } else {
        swal("Cancelled", "Your record is safe :)", "error");
      }
    });
  }



  addDesignation() {
    this.designationModel?.show();
    setTimeout(() => {
      this.designationMstForm.reset();
      this.designationForm?.resetForm();
    }, 0);
  }

  closeModel() {
    this.designationId = 0;
    this.designationModel?.hide();
    this.designationMstForm.reset();
    this.designationForm.reset();
  }

  onRecodeValueChange(value: number) {
    this.recode = value;
    this.pageNumber = 1;
    this.getDesignation();
  }

  onPageChange(value: number) {
    this.pageNumber = value;
    this.getDesignation();
  }

  orderBy(event: any) {
    this.orderby = event;
    this.getDesignation();
  }

  onSearch(event: any) {
    this.searchTerm = event;
    this.getDesignation();
  }

}
