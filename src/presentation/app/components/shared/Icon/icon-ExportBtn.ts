import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-ExportBtn',
    template: `
        <ng-template #template>
        
        <svg width="14px" height="14px" viewBox="0 0 11 11" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M5.5 8.3105L2.71936 5.53064L3.27564 4.96493L5.10714 6.79643V0H5.89286V6.79643L7.72357 4.96571L8.28064 5.53064L5.5 8.3105ZM0 11V7.82729H0.785714V10.2143H10.2143V7.82729H11V11H0Z"
                                            fill="currentColor" />
                                    </svg>

        </ng-template>
    `,
})
export class IconExportBtnComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
