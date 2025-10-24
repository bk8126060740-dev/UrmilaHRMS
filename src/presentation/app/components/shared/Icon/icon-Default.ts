import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-Default',
    template: `
        <ng-template #template>
        
            <svg xmlns="http://www.w3.org/2000/svg" width="16"
                height="16" viewBox="0 0 16 16">
                <path fill="currentColor" fill-rule="evenodd"
                    d="M2 1.5a.5.5 0 0 1 .5-.5H9a.5.5 0 0 1 .354.146l2.5 2.5A.5.5 0 0 1 12 4v2h-1V5H8.5a.5.5 0 0 1-.5-.5V2H3v12h8v-.5h1v1a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5zm7 .707V4h1.793zM6 9h1v3H6zM8 9h1v3H8zM10 9h1v3h-1z"
                    clip-rule="evenodd" />
            </svg>

        </ng-template>
    `,
})
export class IconDefaultComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
