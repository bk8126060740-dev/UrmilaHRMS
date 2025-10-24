import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-right-sign',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
                              xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" x="0" y="0"
                              viewBox="0 0 100 100" style="enable-background:new 0 0 512 512" xml:space="preserve"
                              class="check-active">
                              <g>
                                <path fill="currentColor"
                                  d="M32.402 66.827C44.107 47.41 75.58 24.957 92.963 12.642a2.87 2.87 0 0 1 3.247-.048 2.876 2.876 0 0 1 .27 4.595C75.627 34.805 50.81 55.88 43.316 79.096a2.918 2.918 0 0 1-1.722 1.833c-3.802 1.48-9.603 4.462-13.035 6.538a2.884 2.884 0 0 1-4.072-1.165C19.17 75.855 10.622 62.966 3.531 57.127a2.854 2.854 0 0 1-.16-4.25c14.17-13.546 24.62 5.005 29.03 13.949z"
                                  opacity="1" data-original="#83cf8f"></path>
                              </g>
                            </svg>
        </ng-template>
    `,
})
export class IconRightSignComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
