import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-Pdf',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                viewBox="0 0 16 16">
                                                <path fill="none" stroke="#59AAAA" stroke-linejoin="round"
                                                    d="M4.5 12v-2m0 0V7.5H7V10zM15 7.5h-2.5V10m0 2v-2m0 0H15m-6.5 1.5H11v-4H8.5m0 4.5V7m3 6.5v1h-9v-13h6m0 0v3h3m-3-3H9L11.5 4v.5m0 0V6" />
                                            </svg>
        </ng-template>
    `,
})
export class IconPdfComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
