import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { GrievanceCommentModel, GrievanceModel, statusdataModel } from '../../../../../../domain/models/grievance.model';
import { AppConstant } from '../../../../../../common/app-constant';
import { GrievanceService } from '../../../../../../domain/services/grievance.service';
import { HttpParams } from '@angular/common/http';
import { FileHandle } from '../../../../../../directive/dragDrop.directive';
import { ToasterService } from '../../../../../../common/toaster-service';
import { JwtService } from '../../../../../../common/jwtService.service';
import { PermissionService } from '../../../../../../domain/services/permission.service';
import { GrantPermissionService } from '../../../../../../domain/services/permission/is-granted.service';
import { Router } from '@angular/router';
import { HeaderDropdownService } from '../../../../../../domain/services/header-dropdown.service';
import { LocalStorageService } from '../../../../../../common/local-storage.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-grievance-reply',
  templateUrl: './grievance-reply.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './grievance-reply.component.scss'
})

export class GrievanceReplyComponent {
  grievanceDetails: GrievanceModel = new GrievanceModel();
  grievanceCommentData: GrievanceCommentModel = new GrievanceCommentModel();
  grievanceObject: GrievanceModel = new GrievanceModel();
  grievanceCommentDetails: GrievanceCommentModel[] = [];
  grievanceId: GrievanceCommentModel = new GrievanceCommentModel();
  totalCount: number = 0;
  recode: number = 100000;
  searchTerm: string = '';
  filterTerm: string = '';
  orderby: string = '';
  pageNumber: number = 1;
  messageText: string = '';
  selectedFileName: string = '';
  attachmentFile: File | null = null;
  files: FileHandle[] = [];
  selectedFiles: File[] = [];
  currentTime: Date = new Date();
  baseProfilePicUrl: string = '';
  loginEmployeeId: number = 0;
  employeeIds: number = 0;
  dropdownSubscription: any;
  statusdata: statusdataModel[] = [];
  showDelay = new FormControl(100);
  hideDelay = new FormControl(103);
  @ViewChild('chatBox') private chatBox!: ElementRef;

  constructor(
    private grievanceService: GrievanceService,
    private toaster: ToasterService,
    private jwtService: JwtService,
    private router: Router,
    private headerDropdownService: HeaderDropdownService,
    private grantPermissionService: GrantPermissionService,
    private localStorageService: LocalStorageService

  ) {
    this.loginEmployeeId = parseInt(jwtService.getNameIdentifier() ?? '0');
  }


  checkVlaue(comment: GrievanceCommentModel): boolean {
    return (comment.empInfo && comment.empInfo.userId === this.loginEmployeeId) || (!comment.empInfo && comment.replyInfo?.userId === this.loginEmployeeId);
  }

  ngOnInit(): void {

    const navigationState = history.state;
    if (navigationState) {
      this.grievanceCommentData = navigationState.grievanceCommentData;
      this.grievanceObject = navigationState.grievanceObject
    }
    if (this.grievanceObject?.id) {
      this.getGrievanceData(this.grievanceObject.id);
    }
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    this.dropdownSubscription = this.headerDropdownService.dropdownValue$.subscribe((value) => {
      const project = this.localStorageService.getItem(AppConstant.PROJECTID);

      if (value != project) {
        this.router.navigate(['/grievance/dashboard']);
      }

    });

  }

  ngOnDestroy() {
    if (this.dropdownSubscription) {
      this.dropdownSubscription.unsubscribe();
    }
  }
  onFileSelected(event: any, fileInput: HTMLInputElement): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      Array.from(files).forEach((file: File) => {
        this.selectedFiles.push(file);
      });
    }
    event.target.value = '';
    fileInput.value = '';
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  async getGrievanceCommentAllData() {
    const grievanceId = this.grievanceCommentData.id.toString();
    await this.grievanceService.getGrievanceAllData<GrievanceCommentModel[]>(`${AppConstant.GET_ALL_GRIEVANCE_COMMENT}/${grievanceId}`).subscribe({
      next: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          this.grievanceCommentDetails = response.data.map((m: GrievanceCommentModel) => {
            if (this.loginEmployeeId != this.grievanceDetails.userId) {
              if (m.empInfo?.userId == this.loginEmployeeId) {
                m.empInfo = m.replyInfo;
                m.replyInfo = null;
              }
            }
            else if (this.loginEmployeeId != this.grievanceDetails.userId && m.replyInfo?.userId == this.grievanceDetails.userId) {
              m.replyInfo = m.empInfo;
              m.empInfo = null;
            }
            if (!m.replyInfo?.id) m.replyInfo = null;
            if (!m.empInfo?.id) m.empInfo = null;
            m.profilePic = this.getProfilePicPath(m.replyInfo?.profilePic || m.empInfo?.profilePic || '');
            return m;
          });
          this.scrollToBottom();

        }
        else {
          this.grievanceCommentDetails = [];
        }
      }
    });
  }

  getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'xls':
      case 'xlsx':
        return 'xls';
      case 'pdf':
        return 'pdf';
      case 'doc':
      case 'docx':
        return 'doc';
      case 'jpg':
      case 'jpeg':
        return 'jpg';
      case 'png':
        return 'png';
      case 'svg':
        return 'svg';
      default:
        return 'default';
    }
  }

  getFileName(url: string): string {
    if (!url) return '';
    const decodedUrl = decodeURIComponent(url);
    let filePath = decodedUrl.split('?')[0];
    filePath = filePath.replace(/\\/g, '/');
    let fileNameWithExt = filePath.split('/').pop() || '';
    fileNameWithExt = fileNameWithExt.replace(/^\d+[_\s]/, '');
    return fileNameWithExt;
  }

  GrievanceDownloadFiles(attachment: any) {
    // //const filePath = `${attachment.attachment}`;
    // //const params = new HttpParams().set('filePath', filePath);

    //     //const url = response.url || filePath;
    //     //a.href = url;
    const fileUrl = attachment.attachment;
    const fileName = fileUrl.split('/').pop() || 'download';
    const a = document.createElement('a');
    a.href = fileUrl;
    a.target = '_blank';
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async getGrievanceData(id: number) {
    await this.grievanceService.getGrievanceAllData<GrievanceModel[]>(`${AppConstant.GET_ALL_GRIEVANCE}/` + id).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          const GrievanceId = response.data;
          this.grievanceDetails = response.data;
          this.getStatusAllData(this.grievanceDetails.statusId);
          this.getGrievanceCommentAllData();
        }
      }
    });
  }

  getemployeeId() {
    this.grievanceService.getGrievanceAllData(AppConstant.GET_ALLEMPLOYEE_ID).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.employeeIds = response.data.employeeId;
        }
      }
    });
  }

  async sendMessage() {
    const trimmedMessage = this.messageText.trim();

    if (trimmedMessage === '') {
      this.toaster.errorToaster('Comment cannot be empty.');
      return;
    }

    if (this.selectedFiles.length > 2) {
      this.toaster.warningToaster('You can only attach maximum of 2 files per message');
      return;
    }

    this.currentTime = new Date();
    const formData = new FormData();
    formData.append(`GrievanceId`, this.grievanceObject.id.toString());
    formData.append(`Description`, trimmedMessage);

    this.selectedFiles.forEach((file, index) => {
      formData.append(`Attachments[${index}].index`, (index + 1).toString());
      formData.append(`Attachments[${index}].file`, file);
    });

    await this.grievanceService.postGrievanceComment<GrievanceCommentModel[]>(formData, AppConstant.POST_GRIEVANCE_COMMENT).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.messageText = '';
          this.getGrievanceCommentAllData();
          this.selectedFileName = '';
          this.selectedFiles = [];
        }
      }
    });
  }

  formatTime(date: string): string {
    const createdDate = new Date(date);
    const hours = createdDate.getHours();
    const minutes = createdDate.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const time = `${hours % 12 || 12}.${minutes.toString().padStart(2, '0')}${ampm}`;
    const dayName = createdDate.toLocaleDateString(undefined, { weekday: 'long' });
    return `${dayName}, ${time}`;
  }


  getProfilePicPath(profilePic: string | null | undefined): string {
    if (!profilePic) {
      return 'assets/images/default-profile.png'; // Default profile picture
    }
    return profilePic.startsWith('http') ? profilePic : `${AppConstant.BASE_IMAGEURL}${profilePic}`;
  }

  generateUniqueId(): string {
    return Date.now().toString();
  }

  closeTicket() {
    let obj = {
      grievanceId: this.grievanceObject.id.toString(),
      statusId: 161
    };
    this.grievanceService.postAssignTicket(obj, AppConstant.GET_ALL_GRIEVANCE + '/StatusChange').subscribe({
      next: response => {
        if (response && response.success) {
          this.toaster.successToaster(response.message);
          this.getGrievanceCommentAllData();
          this.router.navigate(['/grievance/dashboard']);
        }
      },
      error: error => {

      },
    });
  }

  reopenTicket() {
    let obj = {
      grievanceId: this.grievanceObject.id.toString(),
      statusId: 164
    };
    this.grievanceService.postAssignTicket(obj, AppConstant.GET_ALL_GRIEVANCE + '/StatusChange').subscribe({
      next: response => {
        if (response && response.success) {
          this.toaster.successToaster(response.message);
          this.getGrievanceCommentAllData();
          this.router.navigate(['/grievance/dashboard']);
        }
      },
      error: error => {

      },
    });
  }

  getStatusAllData(statusId: number) {
    const obj = { codeTypeIds: [41] };
    this.grievanceService.postAssignTicket(obj, AppConstant.POST_GET_ALLLCODESTYPE).subscribe(
      (response: any) => {
        if (response.success) {
          let codeType = response.data[0]?.codes || [];
          if (statusId === 164) {
            this.statusdata = codeType;
          } else {
            this.statusdata = codeType.filter((code: any) =>
              (code.enumItem?.toLowerCase() !== 'reopened') &&
              (code.name?.toLowerCase() !== 'reopened')
            );
          }
        } else {
          this.toaster.errorToaster(response.message);
        }
      }
    );
  }

  async changeStatusTicket(statusId: number) {
    let obj = {
      grievanceId: this.grievanceObject.id.toString(),
      statusId: statusId
    }
    this.grievanceService.postAssignTicket(obj, AppConstant.GET_ALL_GRIEVANCE + '/StatusChange').subscribe({
      next: response => {
        if (response && response.success) {
          this.toaster.successToaster(response.message);
          this.router.navigate(['/grievance/dashboard']);
        }
      },
      error: error => {

      },
    });
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnChanges() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatBox?.nativeElement) {
        this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
      }
    }, 100);
  }

}
