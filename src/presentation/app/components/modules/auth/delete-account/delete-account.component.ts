import { Component } from '@angular/core';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss'
})
export class DeleteAccountComponent {
  identifier: string = '';
  requestSubmitted: boolean = false;
  emailOrUsernamePattern = '(^[a-zA-Z0-9._-]{3,}$)|(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$)';

  onSubmit(form: any) {
    if (form.valid) {
      this.requestSubmitted = true;
      
    }
  }
}
