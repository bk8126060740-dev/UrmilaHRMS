import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-ColumnRight',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em"
            height="1em" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor"
                stroke-linecap="round" stroke-linejoin="round"
                stroke-width="2" d="M20 7L10 17l-5-5" />
        </svg> 
        </ng-template>
    `,
})
export class IconColumnRightComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
