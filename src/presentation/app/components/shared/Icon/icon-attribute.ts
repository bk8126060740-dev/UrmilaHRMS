import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-attribute',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20">
            <path fill="currentColor"
                d="M7 15h12v2H7zm0-6h12v2H7zm0-6h12v2H7z" />
            <circle cx="3" cy="4" r="2"
                fill="currentColor" />
            <circle cx="3" cy="10" r="2"
                fill="currentColor" />
            <circle cx="3" cy="16" r="2"
                fill="currentColor" />
        </svg>
        </ng-template>
    `,
})
export class IconAttributeComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
