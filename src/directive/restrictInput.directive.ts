import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appRestrictInput]'
})
export class RestrictInputDirective {
    @Input() maxChars: number = 10; 

        constructor(private ngControl: NgControl) { }
    @HostListener('keypress', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        const charCode = event.charCode || event.keyCode;
        const char = String.fromCharCode(charCode);
        if (!/^\d$/.test(char)) {
            event.preventDefault();
        }
        const currentValue = this.ngControl.control?.value || '';
        if (currentValue.length >= this.maxChars) {
            event.preventDefault();
        }
    }
    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent): void {
        const clipboardData = event.clipboardData || (window as any).clipboardData;
        const pastedText = clipboardData.getData('text');

        if (!/^\d+$/.test(pastedText)) {
            event.preventDefault();
            return;
        }

        const currentValue = this.ngControl.control?.value || '';
        if ((currentValue + pastedText).length > this.maxChars) {
            event.preventDefault();
        }
    }
}
