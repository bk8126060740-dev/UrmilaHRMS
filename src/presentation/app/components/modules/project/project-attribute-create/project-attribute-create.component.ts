import { Component, ElementRef, HostListener, ViewChild, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { HttpParams } from "@angular/common/http";
import { AppConstant } from "../../../../../../common/app-constant";
import { GlobalConfiguration } from "../../../../../../common/global-configration";
import {
  AttriuteFormulla,
  Formulla,
  GetProjectPayrollAttributeWithoutFilter,
  ProjectPayrollAttributeDaum,
  RequestedBody,
} from "../../../../../../domain/models/projectPayrollAttribute.model";
import { ProjectPayrollAttributeService } from "../../../../../../domain/services/projectPayrollAttribute.service";
import { ToastrService } from "ngx-toastr";
import { MessageConstant } from "../../../../../../common/message-constant";
import swal from "sweetalert";
import { sequence } from "@angular/animations";
import { FormulaValidationService } from "../../../../../../common/formula-validation.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ToasterService } from "../../../../../../common/toaster-service";
import { GrantPermissionService } from "../../../../../../domain/services/permission/is-granted.service";
import { RecruitmentService } from "../../../../../../domain/services/recruitment.service";
import { ProjectDropdown } from "../../../../../../domain/models/recruitment.model";
import { NavigationExtras, Router } from "@angular/router";
import { FormControl } from "@angular/forms";

declare var $: any;

@Component({
  selector: 'app-project-attribute-create',
  templateUrl: './project-attribute-create.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './project-attribute-create.component.scss'
})
export class ProjectAttributeCreateComponent implements AfterViewInit {
  @ViewChild("attributemodel")
  public attributeModel!: ModalDirective | undefined;
  operators = AppConstant.OPERATORS;
  formula: Formulla[] = [];
  searchText: string = '';
  orderby: string = '';
  groupedArray: GroupedData[] = [];
  cloneGroupedArray: GroupedData[] = [];
  isCalculated: boolean = false;
  totalCount: number = 0;
  pageNumber: number = 1;
  recode: number = 10;
  searchTerm: string = "";
  formulaDefualtValue: number = 0;
  rowData: ProjectPayrollAttributeDaum[] = [];
  cloneRowData: ProjectPayrollAttributeDaum[] = [];
  allProjectAttribute: ProjectPayrollAttributeDaum[] = [];
  filteredAttributes = [...this.allProjectAttribute];
  attributeArray: GetProjectPayrollAttributeWithoutFilter[] = [];
  attributeDropdownArray: GetProjectPayrollAttributeWithoutFilter[] = [];
  disableAttributeDropdownArray: GetProjectPayrollAttributeWithoutFilter[] = [];

  selectedAttributes: any = undefined;
  removedAttributes: any[] = [];
  selectedOperators: string[] = [];
  validationMessage: string = "";
  IsEditMode: boolean = false;
  resultFormula: boolean = false;
  requestBody: RequestedBody = new RequestedBody();
  payrollAttributeId: number = 0;
  requestBodyFormula: AttriuteFormulla[] = [];
  projectRowData: any;
  IsEditable: boolean = false;
  projectDropdownData: ProjectDropdown[] = [];
  filteredProjectDropdownData: ProjectDropdown[] = [];
  selectedProject: number = 0;
  allowOverWrite: boolean = false;
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);

  // Tags input properties
  selectedTags: string[] = [];
  selectedSkills: any[] = [];
  availableSkills = [
    { id: 1, name: 'Angular', category: 'Frontend' },
    { id: 2, name: 'React', category: 'Frontend' },
    { id: 3, name: 'Vue.js', category: 'Frontend' },
    { id: 4, name: 'Node.js', category: 'Backend' },
    { id: 5, name: 'Python', category: 'Backend' },
    { id: 6, name: 'Java', category: 'Backend' },
    { id: 7, name: 'SQL', category: 'Database' },
    { id: 8, name: 'MongoDB', category: 'Database' },
    { id: 9, name: 'TypeScript', category: 'Language' },
    { id: 10, name: 'JavaScript', category: 'Language' }
  ];
  columns = [
    {
      field: "payrollAttributeName",
      displayName: "Attribute",
      sortable: true,
      filterable: true,
      visible: true,
    },
    {
      field: "isCalculated",
      displayName: "Is Calculated",
      sortable: true,
      filterable: true,
      visible: true,
    },
    {
      field: "defaultValue",
      displayName: "Default Value",
      sortable: true,
      filterable: true,
      visible: true,
    },
    {
      field: "allowOverride",
      displayName: "Allow Override",
      sortable: true,
      filterable: true,
      visible: true,
    },
  ];
  @ViewChild('CloneAttributeModel', { static: false }) public CloneAttributeModel:
    | ModalDirective
    | undefined;

  constructor(
    private projectPayrollAttributeService: ProjectPayrollAttributeService,
    private toaster: ToasterService,
    private formulaValidationService: FormulaValidationService,
    private grantPermissionService: GrantPermissionService,
    private recruitmentService: RecruitmentService,
    private router: Router
  ) {
    this.getAllProjectAttribute();
    this.getAllProjectPayrollAttributeWithoutFilter();
  }

  lastOpenedIndex: number = 0;
  onAccordionToggle(index: number) {
    this.lastOpenedIndex = index;
  }

  @HostListener('document:keydown.control.s', ['$event'])
  onCtrlS(event: KeyboardEvent) {
    event.preventDefault(); 
    console.log('Ctrl + S pressed');
    this.createFormula();
  }

  @HostListener('document:keydown.control.c', ['$event'])
  onCtrlC(event: KeyboardEvent) {
    event.preventDefault(); 
    this.navigateToDashboard();

  }

  async ngOnInit() {

    if (history.state.projectRowData != null || history.state.projectRowData != undefined) {
      this.projectRowData = history.state.projectRowData;
      this.requestBody.projectId = this.projectRowData.id;
      if (history.state.projectAttributeRowData != null || history.state.projectAttributeRowData != undefined) {
        if (this.allProjectAttribute.length > 0) {
          this.onEdit(history.state.projectAttributeRowData);
        } else {
          await this.projectPayrollAttributeService.getProjectPayrollAttribute(`${AppConstant.GET_PROJECTATTRIBUTEBYPROJECTEWITHOUTFILTER}${this.projectRowData.id}`).subscribe({
            next: (response) => {
              if (response) {
                this.allProjectAttribute = response.data;
                this.filteredAttributes = [...this.allProjectAttribute];
                this.onEdit(history.state.projectAttributeRowData);

              }
            },
            error: (error) => {
            },
          });

        }
      }
    } else {
      this.navigateToDashboard();

    }
    this.getAllProjectAttribute();
    this.getAllProjectPayrollAttributeWithoutFilter();


  }

  navigateToDashboard() {
    const navigationExtras: NavigationExtras = {
      state: {
        projectRowData: this.projectRowData,
      },
    };
    this.router.navigate(["/project/attribute"], navigationExtras);
  }

  clonebuttonClick() {
    this.selectedProject = 0;
    this.cloneRowData = [];
    this.cloneGroupedArray = [];
    this.getAllProject();
    this.CloneAttributeModel?.show();
  }

  async getAllProject() {
    await this.recruitmentService.getProjectDropdownData(`${AppConstant.GET_PROJECTDROPDOWN}`).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.projectDropdownData = response.data;
          this.filterFromProjectDropdown();
        }
      },
    });
  }

  onGroupCheckBoxChange(event: any, i: any, item: GroupedData) {
    const checkedEvent = event.checked;
    item.isSelected = checkedEvent;
    item.items.forEach(element => {
      element.isSelected = checkedEvent
    });
  }

  onItemCheckBoxChange(event: any, i: any, item: GroupedData) {
    const checkedEvent = event.checked;
    item.items[i].isSelected = checkedEvent;

    // Check if all items are selected
    const allItemsSelected = item.items.every(el => el.isSelected);

    // Update the group checkbox state based on items' state
    item.isSelected = allItemsSelected;
  }

  onProjectChange(event: any) {
    if (event) {
      this.selectedProject = event.id;
      this.getCloneProjectAttribute(this.selectedProject);
    } else {
      this.selectedProject = 0;
      this.cloneRowData = [];
      this.cloneGroupedArray = [];
    }
  }

  filterFromProjectDropdown() {
    this.filteredProjectDropdownData = this.projectDropdownData.filter(
      project => project.id !== this.projectRowData.id
    );
  }

  closeCloneModel() {
    this.CloneAttributeModel?.hide();
    this.selectedProject = 0;
    this.cloneRowData = [];
    this.cloneGroupedArray = [];
  }

  async getCloneProjectAttribute(projectId: any) {

    await this.projectPayrollAttributeService.getProjectPayrollAttribute(`${AppConstant.GET_PROJECTATTRIBUTEBYPROJECTEWITHOUTFILTER}${projectId}`).subscribe({
      next: (response) => {
        if (response.status === 200 && response.success) {
          this.cloneRowData = response.data;
          this.cloneGroupedArray = Object.values(
            this.cloneRowData.reduce((groups: Record<string, GroupedData>, item) => {
              const groupKey = item.groupId !== null ? item.groupId.toString() : "null"; 

              if (!groups[groupKey]) {
                groups[groupKey] = {
                  groupId: item.groupId,
                  groupName: item.groupName,
                  items: [],
                  isSelected: false
                };
              }

              groups[groupKey].items.push(item);

              return groups;
            }, {})
          ).map(group => {
            // Sort items by sequence within each group
            group.items.sort((a, b) => a.sequence - b.sequence);
            return group;
          });
        }
      },
      error: (error) => {
      },
    });
  }

  CloneProjectAttribute() {
    if (this.selectedProject != 0) {


      let obj = {
        "toProjectId": this.projectRowData.id,
        "fromProjectId": this.selectedProject,
        "isOverride": this.allowOverWrite
      }

      this.projectPayrollAttributeService.postProjectPayrollAttribute(obj, AppConstant.GET_PROJECTATTRIBUTE + '/CopyAttribute').subscribe({
        next: (response) => {
          this.toaster.successToaster(response.message);
          this.closeCloneModel();
          this.getProjectAttribute();
          this.getAllProjectAttribute();
          this.getAllProjectPayrollAttributeWithoutFilter();
        }
      })

      console.log(obj);
    } else {
      this.toaster.warningToaster('You need to select from project first!!');
    }

  }


  async getProjectAttribute() {
    await this.projectPayrollAttributeService.getProjectPayrollAttribute(`${AppConstant.GET_PROJECTATTRIBUTEBYPROJECTEWITHOUTFILTER}${this.projectRowData.id}`).subscribe({
      next: (response) => {
        if (response.status === 200 && response.success) {
          this.rowData = response.data;
          this.groupedArray = Object.values(
            this.rowData.reduce((groups: Record<string, GroupedData>, item) => {
              const groupKey = item.groupId !== null ? item.groupId.toString() : "null"; 

              // Initialize the group if it doesn't exist
              if (!groups[groupKey]) {
                groups[groupKey] = {
                  groupId: item.groupId,
                  groupName: item.groupName,
                  items: [],
                  isSelected: false
                };
              }

              groups[groupKey].items.push(item);

              return groups;
            }, {})
          ).map(group => {
            group.items.sort((a, b) => a.sequence - b.sequence);
            return group;
          });
          console.log(this.groupedArray);

          this.totalCount = response.totalCount;
        }
      },
      error: (error) => {
      },
    });
  }

  async getAllProjectAttribute() {

    await this.projectPayrollAttributeService.getProjectPayrollAttribute(`${AppConstant.GET_PROJECTATTRIBUTEBYPROJECTEWITHOUTFILTER}${this.projectRowData.id}`).subscribe({
      next: (response) => {
        if (response) {
          this.allProjectAttribute = response.data;
          this.filteredAttributes = [...this.allProjectAttribute];
        }
      },
      error: (error) => {
      },
    });
  }

  async getAllProjectPayrollAttributeWithoutFilter() {
    await this.projectPayrollAttributeService.getAllProjectPayrollAttributeWithoutFilter(`${AppConstant.GET_PAYROLL_ATTRIBUTE}`).subscribe({
      next: (response) => {
        if (response) {
          GlobalConfiguration.consoleLog(
            "*Project Payroll Attribute Without Filter get Response",
            "response:",
            response
          );
          this.attributeArray = response.data;


          this.attributeDropdownArray = response.data;
          this.disableAttributeDropdownArray = response.data;
          this.attributeDropdownArray = this.attributeArray.filter(attribute =>
            !this.allProjectAttribute.some(
              projectAttribute => projectAttribute.payrollAttributeId === attribute.id
            )
          );


        }
      },
      error: (error) => {
      },
    });
  }

  onAttributeChange(event: any) {

    if (this.formula.length > 0) {
      swal({
        title: "Are you sure?",
        text: "You will not be able to recover this Formula!",
        icon: "warning",
        buttons: ["No", "Yes"],
        dangerMode: true,
      }).then((willChange) => {
        if (willChange) {
          this.formula = [];
          const selectedId = event.id;
          this.requestBody.payrollAttributeId = selectedId;
          if (this.requestBody.payrollAttributeId > 1) {
            this.attributeArray.forEach((element) => {
              if (element.id == this.requestBody.payrollAttributeId) {
                element.visible = false;
              } else {
                element.visible = true;
              }
            });
          }
        } else {
          this.payrollAttributeId = this.requestBody.payrollAttributeId;
        }
      });
    } else {
      //
      const selectedId = event.id;
      this.requestBody.payrollAttributeId = selectedId;
      if (this.requestBody.payrollAttributeId > 1) {
        this.attributeDropdownArray.forEach((element) => {
          if (element.id == this.requestBody.payrollAttributeId) {
            this.isCalculated = element.isCalculated;
            this.requestBody.isCalculated = this.isCalculated;
          }
        });
      }
    }
  }

  filterAttributes() {
    this.filteredAttributes = this.allProjectAttribute.filter(attribute =>
      attribute.payrollAttributeName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
  }

  onAttributeSelect(attribute: any) {
    if (this.selectedAttributes != undefined || this.selectedAttributes != null) {
      const newItem = new Formulla();
      newItem.id = attribute.id;
      newItem.name = attribute.payrollAttributeName;
      newItem.order = this.formula.length + 1;
      newItem.isAttribute = true;
      this.formula.push(newItem);
    } else {
      this.toaster.warningToaster(MessageConstant.PROJECTATTRIBUTENOSELECT);
    }
  }

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  onOperatorSelect(operator: string) {
    const newItem = new Formulla();
    newItem.name = operator;
    newItem.order = this.formula.length + 1;
    newItem.isOperator = true;
    this.formula.push(newItem);
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  removeItem(item: any) {
    this.formula.splice(item, 1);
    this.updateOrder();
  }

  updateOrder() {
    this.formula.forEach((item, index) => {
      item.order = index + 1;
    });
  }
  orderBy(event: any) {
    this.orderby = event;
    this.getProjectAttribute();
  }

  onSearch(search: string) {
    this.searchTerm = search;
    this.getProjectAttribute();
  }

  addDefualtValue() {
    if (this.formulaDefualtValue >= 0) {
      const newItem = new Formulla();
      newItem.name = "";
      newItem.order = this.formula.length + 1;
      newItem.defaultValue = this.formulaDefualtValue;
      newItem.isDefault = true;
      this.formula.push(newItem);
      this.formulaDefualtValue = 0;
      this.scrollToBottom();
    } else {
    }
  }
  resetAll() {
    this.formula = [];
    this.validationMessage = "";
  }
  getRandomNumber(): number {
    return Math.floor(Math.random() * 100);
    return Math.floor(Math.random() * 100);
  }
  toExpressionStringWithRandomNumbers(formulaItems: Formulla[]): string {
    return formulaItems
      .map((item) => {
        if (item.isOperator) {
          return item.name;
        } else if (item.isDefault) {
          return item.defaultValue;
        } else {
          return `${this.getRandomNumber()}`;
        }
      })
      .join("");
  }


  //     // console.log(expression);
  //     // console.log(result);


  addattribute() {
    this.resetPopup();
    this.attributeModel?.show();
  }

  onDelete(event: any) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.deleteFormula(event);
      } else {
        swal("Cancelled", "Your record is safe :)", "error");
      }
    });
  }


  deleteFormula(event: any) {
    let params = new HttpParams().set("id", event.id);
    (
      this.projectPayrollAttributeService.deleteProjectPayrollAttribute(
        `${AppConstant.DELETE_PROJECTPAYROLLATTRIBUTE}${event.id}`,
        params
      )
    ).subscribe(
      (response) => {
        if (response && response.success) {
          GlobalConfiguration.consoleLog(
            "Project payroll component",
            "Delete Project payroll attribute Response:",
            response
          );
          this.getProjectAttribute();
          this.toaster.successToaster("Delete ", response.message);
          this.totalCount = this.totalCount - 1;
        }
      },
      (error) => {
        GlobalConfiguration.consoleLog(
          "Project payroll component",
          "Delete Project payroll error:",
          error
        );
      }
    );
  }

  onEdit(event: any) {

    this.IsEditable = true;

    console.log("on edit", event);
    this.searchText = '';
    this.requestBody = new RequestedBody;
    this.selectedAttributes = event.payrollAttributeId;
    this.requestBody.allowOverride = event.allowOverride;
    this.requestBody.defaultValue = event.defaultValue === null ? 0 : event.defaultValue;
    this.requestBody.id = event.id;
    this.requestBody.payrollAttributeName = event.payrollAttributeName;
    this.requestBody.isCalculated = event.isCalculated;
    this.isCalculated = event.isCalculated;
    this.payrollAttributeId = event.payrollAttributeId;
    this.requestBody.payrollAttributeId = event.payrollAttributeId;
    this.requestBody.projectId = event.projectId;
    this.requestBody.formulas = event.isCalculated;
    this.requestBody.formulas = event.formulas;
    this.formula = [];
    this.requestBody.formulas.sort((a, b) => a.sequence - b.sequence);
    for (let i = 0; i < this.requestBody.formulas.length; i++) {

      let obj = this.requestBody.formulas[i];
      let SourceProjectPayrollAttributeId = obj.sourceProjectPayrollAttributeId;

      let fixedValue = obj.fixedValue;
      let operator = obj.operator;
      let acId = obj.id;
      if (SourceProjectPayrollAttributeId && acId) {
        if (SourceProjectPayrollAttributeId > 0) {
          let name = "";
          this.allProjectAttribute.forEach(element => {
            if (element.id == SourceProjectPayrollAttributeId) {
              name = element.payrollAttributeName;
            }
          });
          const newItem = new Formulla();
          newItem.id = SourceProjectPayrollAttributeId;
          newItem.acId = acId;
          newItem.name = name;
          newItem.order = this.formula.length + 1;
          newItem.isAttribute = true;
          this.formula.push(newItem);
        }
      } else {
        if (fixedValue != null && acId) {
          if (fixedValue >= 0) {
            const newItem = new Formulla();
            newItem.name = "";
            newItem.acId = acId;
            newItem.order = this.formula.length + 1;
            newItem.defaultValue = fixedValue;
            newItem.isDefault = true;
            this.formula.push(newItem);
            this.formulaDefualtValue = 0;
          }
        }
      }
      if (operator && acId) {
        if (operator != null) {
          const newItem = new Formulla();
          newItem.acId = acId;
          newItem.name = operator;
          newItem.order = this.formula.length + 1;
          newItem.isOperator = true;
          this.formula.push(newItem);
        }
      }

    }
    this.attributeModel?.show();
  }

  onPageChange(event: any) {
    this.pageNumber = event;
    this.getProjectAttribute();
  }

  onSwitchChange(event: any) {
    this.isCalculated = event.target.checked;
    this.requestBody.isCalculated = this.isCalculated;
  }

  createFormula() {
    this.evaluate();
    if (!this.resultFormula && this.isCalculated) {
      this.validationMessage = "Formula is Empty or not valid.";
      return;
    }
    for (let i = 0; i < this.formula.length; i++) {
      let item = this.formula[i]
      let fixValue: number | null = null;
      let operator: string | null = null;
      let ProjectPayrollAttributeId: number | null = null;
      let acId: number = 0;
      if (item.isAttribute || item.isDefault) {
        if (item.isAttribute) {
          ProjectPayrollAttributeId = item.id;
          fixValue = null; //typeof item.defaultValue === 'number' ? item.defaultValue : parseFloat(item.defaultValue as string);
          operator = null;
          acId = item.acId;
        } else if (item.isDefault) {
          fixValue = typeof item.defaultValue === 'string' ? parseFloat(item.defaultValue) : item.defaultValue;
          operator = null;
          acId = item.acId;
          ProjectPayrollAttributeId = null;
        }
        let k = i + 1;
        for (let j = k; j <= k; j++) {
          if (this.formula.length > j) {
            let itemNext = this.formula[j];
            if (itemNext.isOperator) {
              operator = itemNext.name;
              i = j;
            }
          }

        }
      } else {
        if (item.isOperator) {
          operator = item.name;
          acId = item.acId;
          ProjectPayrollAttributeId = null;
          fixValue = null;
        }
      }
      let obj = {
        id: acId,
        sequence: this.requestBodyFormula.length,
        sourceProjectPayrollAttributeId: ProjectPayrollAttributeId,
        fixedValue: fixValue,
        operator: operator
      }
      this.requestBodyFormula.push(obj);
    }

    this.requestBody.formulas = this.requestBodyFormula;
    if (this.selectedAttributes == undefined || this.selectedAttributes == null) {
      this.toaster.errorToaster('First Select Attribute!!')
      return;
    } else if (this.isCalculated) {
      if (this.formula.length === 0) {
        this.resultFormula = false;
        this.IsEditMode = false;
        this.validationMessage = "Formula is Empty or not valid.";
        return;
      }
    }

    if (this.requestBody.id > 0) {
      this.projectPayrollAttributeService.putProjectPayrollAttribute(this.requestBody, AppConstant.POST_PROJECTATTRIBUTE + "/" + this.requestBody.id).subscribe({
        next: (response) => {
          if (response) {
            GlobalConfiguration.consoleLog(
              "*Project Payroll Attribute Without Filter get Response",
              "response:",
              response
            );
            this.toaster.successToaster("Update successfully");
            this.resetPopup();
            this.navigateToDashboard();
          }
        },
        error: (error) => {
          console.log("Error:", error);
        },
      });
    } else {
      this.projectPayrollAttributeService.postProjectPayrollAttribute(this.requestBody, AppConstant.POST_PROJECTATTRIBUTE).subscribe({
        next: (response) => {
          if (response) {
            GlobalConfiguration.consoleLog(
              "*Project Payroll Attribute Without Filter get Response",
              "response:",
              response
            );
            this.toaster.successToaster("Added successfully");
            this.resetPopup();
            this.navigateToDashboard();


          }
        },
        error: (error) => {
        },
      });
    }
  }

  resetPopup() {
    this.IsEditable = false;
    this.selectedAttributes = undefined;
    this.payrollAttributeId = 0;
    this.requestBodyFormula = [];
    this.validationMessage = "";
    this.searchText = "";
    this.getProjectAttribute();
    this.getAllProjectAttribute();
    this.getAllProjectPayrollAttributeWithoutFilter();
    this.requestBody.id = 0;
    this.isCalculated = false;
    this.requestBody.payrollAttributeId = 1;
    this.requestBody.isCalculated = false;
    this.requestBody.defaultValue = 0;
    this.requestBody.allowOverride = true;
    this.requestBody.formulas = [];
    this.formula = [];
  }

  formula_test: string = '';
  result: number | null = null;

  evaluate() {
    //
    const expression = this.toExpressionStringWithRandomNumbers(this.formula);
    let newString = expression.replaceAll("IF", "ternary")
      .replaceAll("&&", " and ")
      .replaceAll("||", " or ");

    let final = this.modifyString(newString);

    if (this.formulaValidationService.validateFormula(final)) {


      if (this.isCalculated) {
        if (this.formula.length === 0) {
          this.resultFormula = false;
          this.validationMessage = "Formula is Empty or not valid.";
          this.IsEditMode = false;
          return;
        } else {
          this.result = this.formulaValidationService.evaluateFormula(final);
          this.resultFormula = true;
          this.validationMessage = "Formula is valid";
          this.IsEditMode = true;
        }
      } else {
        this.result = this.formulaValidationService.evaluateFormula(final);
        this.resultFormula = true;
        this.validationMessage = "Formula is valid";
        this.IsEditMode = true;
      }

    } else {
      this.resultFormula = false;
      this.validationMessage = "Formula is Empty or not valid.";
      this.IsEditMode = false;
    }
  }

  modifyString(input: string): string {
    // Check if the input contains ROUND with proper parentheses
    let output;
    if (/ROUND\s*\([^()]+\)/.test(input)) {
      output = input.replace(/ROUND\s*\(\s*([^()]+?)\s*\)/, '$1');
    } else if (input.startsWith("ROUNDUP")) {
      output = input.replace(/ROUNDUP\(|ROUND\(/, '').replace(/,\d+\)$/, '');
    } else if (input.startsWith("ROUND")) {
      const regex = /\d\)$/;
      if (regex.test(input.slice(-3))) {
        output = input.slice(6, -3);
      } else {
        output = input.slice(6, -1);
      }
    } else {
      output = input;
    }
    return output;



  }

  setSequence: { groupId: number; id: number; sequence: number }[] = [];

  drop(event: CdkDragDrop<string[]>, item: any, i: any) {
    let aceess;
    this.grantPermissionService.hasPermission("Update").subscribe({
      next: (response) => {
        aceess = response;
      }
    })
    if (aceess) {

      moveItemInArray(item, event.previousIndex, event.currentIndex);
      this.setSequence = this.groupedArray[i].items
        .filter(group => group.groupId !== null) // Filter out null groupId
        .map((group, index) => ({
          groupId: group.groupId as number, // Ensure groupId is a number
          id: group.id || 0, // Use a default value for id if not present
          sequence: index + 1
        }));

      console.log('Updated Sequence:', this.setSequence);
      let obj = {
        setSequence: this.setSequence
      }
      this.projectPayrollAttributeService.postProjectPayrollAttribute(obj, AppConstant.SET_SEQUENCE_PROJECT_PAYROLL).subscribe({
        next: (response) => {
          if (response.success) {
            this.toaster.successToaster(response.message)
            for (let j = 0; j < this.groupedArray[i].items.length; j++) {
              const element = this.groupedArray[i].items[j];
              element.sequence = j + 1;
            }
          } else {
            this.toaster.successToaster(response.message)
          }
        }
      })
    } else {
      this.toaster.warningToaster(AppConstant.NOTPERMISSION);
    }
  }

  ngAfterViewInit() {
    
  }

  onTagsChange(tags: string[]) {
    this.selectedTags = tags;
    console.log('Tags changed:', tags);
  }

  onSkillsChange(skills: any[]) {
    this.selectedSkills = skills;
    console.log('Skills changed:', skills);
  }

  getSelectedTagsText(): string {
    if (!this.selectedTags || this.selectedTags.length === 0) {
      return 'None';
    }
    return this.selectedTags.join(', ');
  }

  getSelectedSkillsText(): string {
    if (!this.selectedSkills || this.selectedSkills.length === 0) {
      return 'None';
    }
    return this.selectedSkills.map(skill => skill.name).join(', ');
  }
}
interface GroupedData {
  groupId: number | null;
  groupName: string;
  isSelected: boolean;
  items: ProjectPayrollAttributeDaum[];
}
