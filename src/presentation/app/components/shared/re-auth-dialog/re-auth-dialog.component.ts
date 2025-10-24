import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from '../../../../../domain/services/authentication.service';
import { ToasterService } from '../../../../../common/toaster-service';

@Component({
    selector: 'app-re-auth-dialog',
    templateUrl: './re-auth-dialog.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`
    .modal-content {
      padding: 20px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .modal-footer {
      padding: 15px 0 0 0;
    }
    .close{
        background-color: transparent;
        border: none;
    }
    .close span{
        font-size: 20px;
    }
    h5{
        font-size: 16px;
    }
    label{
        font-size: 12px;
        margin-bottom: 5px;
    }
    .btn{
        opacity:1 !important;
        font-size: 14px !important;
        padding: 10px 20px !important;
        border:none !important;
    }
    .btn-1{
        background-color: #4285f4 !important;
        opacity:1 !important;
        cursor: pointer !important;
    }
    .custom-form-field .mdc-text-field--outlined .mat-mdc-form-field-infix{
        padding-top: 2px !important;
    }
    .mat-icon {
        cursor: pointer;
        color: rgba(0, 0, 0, 0.54);
    }
    .mat-icon:hover {
        color: rgba(0, 0, 0, 0.87);
    }
    `]
})
export class ReAuthDialogComponent {
    reAuthForm: FormGroup;
    hide: boolean = true;
    isLoading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ReAuthDialogComponent>,
        private authService: AuthenticationService,
        private toasterService: ToasterService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.reAuthForm = this.fb.group({
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.reAuthForm.valid) {
            this.isLoading = true;
            const password = this.reAuthForm.get('password')?.value;
            this.authService.reAuthenticate(password).subscribe({
                next: (response) => {
                    this.isLoading = false;
                    if (response.success) {
                        this.dialogRef.close(true);
                    } else {
                        this.toasterService.errorToaster('Invalid password');
                    }
                },
                error: () => {
                    this.isLoading = false;
                    this.toasterService.errorToaster('Invalid password');
                }
            });
        }
    }

    onCancel() {
        this.dialogRef.close(false);
    }
} 
