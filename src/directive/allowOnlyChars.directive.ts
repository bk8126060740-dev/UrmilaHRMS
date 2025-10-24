import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appAllowOnlyChars]'
})
export class AllowOnlyCharsDirective {
    @HostListener('keypress', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        const charCode = event.charCode || event.keyCode;
        const char = String.fromCharCode(charCode);
        const regex = /^[a-zA-Z\s]*$/;

        if (!regex.test(char)) {
            event.preventDefault();
        }
    }
}
