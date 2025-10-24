import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-bankSheet',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="512" height="512" x="0" y="0"
            viewBox="0 0 512.001 512.001"
            style="enable-background:new 0 0 512 512"
            xml:space="preserve" class="">
            <g>
                <path
                    d="M2.683 505.555A15.003 15.003 0 0 0 15.002 512h481.996c4.922 0 9.521-2.417 12.319-6.445a14.975 14.975 0 0 0 1.729-13.813c-5.845-15.63-16.772-29.341-21.211-34.497a14.977 14.977 0 0 0-11.382-5.244H33.547c-4.38 0-8.54 1.919-11.382 5.244-4.438 5.156-15.366 18.867-21.211 34.497a14.972 14.972 0 0 0 1.729 13.813zM60 241h91v181H60zM211 241h90v181h-90zM361 241h91v181h-91zM32.467 206.584c2.816 2.827 6.735 4.417 10.611 4.417l.007-.002c.002 0 .005.002.007-.008h425.816c.002.01.005.008.007.008l.007.002c3.876 0 7.795-1.589 10.611-4.417 3.052-3.052 25.862-26.807 32.466-55.583H0c6.605 28.776 29.414 52.531 32.467 55.583zM502.453 121 262.709 1.582a15.019 15.019 0 0 0-13.418 0L9.547 121z"
                    fill="currentColor" opacity="1"
                    data-original="#000000" class="">
                </path>
            </g>
        </svg>
        </ng-template>
    `,
})
export class IconBankSheetComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
