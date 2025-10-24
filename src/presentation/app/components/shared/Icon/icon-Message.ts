import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-Message',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
            xmlns:xlink="http://www.w3.org/1999/xlink" width="18px" height="18px" x="0"
            y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512"
            xml:space="preserve">
            <g>
                <path fill="#8F959D" fill-rule="evenodd"
                    d="M14.15 1.75h-4.3c-4.054 0-6.081 0-7.34 1.264-1.26 1.264-1.26 3.299-1.26 7.368v.54c0 4.068 0 6.103 1.26 7.367.58.583 1.397.972 2.454 1.167.324.06.486.09.557.191.07.102.041.264-.017.588-.14.784-.118 1.494.385 1.87.527.384 1.367-.027 3.047-.849.186-.09.373-.184.56-.278l.003-.001c.997-.499 2.013-1.007 3.097-1.257.472-.108.951-.154 1.554-.167 4.054 0 6.081 0 7.34-1.264 1.26-1.264 1.26-3.299 1.26-7.368v-.54c0-4.068 0-6.103-1.26-7.367-1.259-1.264-3.286-1.264-7.34-1.264zm2.6 11.75a.75.75 0 0 1-.75.75H8a.75.75 0 0 1 0-1.5h8a.75.75 0 0 1 .75.75zm-4-5a.75.75 0 0 1-.75.75H8a.75.75 0 0 1 0-1.5h4a.75.75 0 0 1 .75.75z"
                    clip-rule="evenodd" opacity="1" data-original="#000000" class="">
                </path>
            </g>
        </svg>
        </ng-template>
    `,
})
export class IconMessageComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
