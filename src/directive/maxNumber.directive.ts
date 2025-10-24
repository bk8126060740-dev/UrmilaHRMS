import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appMaxNumber]'
})
export class MaxNumberDirective {
    @Input() appMaxNumber!: number;

    constructor(private ngControl: NgControl) { }
    @HostListener('keypress', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        const charCode = event.charCode || event.keyCode;
        const char = String.fromCharCode(charCode);
        if (!/^\d$/.test(char)) {
            event.preventDefault();
        }
    }
    @HostListener('input', ['$event'])
    onInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = parseInt(input.value, 10);

        if (value > this.appMaxNumber) {
            this.ngControl.control?.setValue(this.appMaxNumber);
        }
    }
}
