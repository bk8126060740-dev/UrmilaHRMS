import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class ToasterService {

    constructor(private toaster: ToastrService) { }

    successToaster(msg: string, title?: string) {
        this.toaster.success(msg, title);
    }

    errorToaster(msg: string, title?: string){
        this.toaster.error(msg, title);
        
    }

    warningToaster(msg: string, title?: string){
        this.toaster.warning(msg, title);
    }
}

