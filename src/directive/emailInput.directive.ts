import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appEmailInput]'
})
export class EmailInputDirective {
    private emailRegex = /^[a-zA-Z0-9@._-]+$/; 

    constructor(private ngControl: NgControl) { }
    @HostListener('keypress', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        const char = String.fromCharCode(event.keyCode || event.which);
        if (!this.emailRegex.test(char)) {
            event.preventDefault();
        }
    }
    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent): void {
        const clipboardData = event.clipboardData || (window as any).clipboardData;
        const pastedText = clipboardData.getData('text');
        if (!this.emailRegex.test(pastedText)) {
            event.preventDefault();
        }
    }
    @HostListener('blur', ['$event'])
    onBlur(event: FocusEvent): void {
        const input = event.target as HTMLInputElement;
        const value = input.value;
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)) {
            this.ngControl.control?.setErrors({ invalidEmail: true });
        }
    }
}
