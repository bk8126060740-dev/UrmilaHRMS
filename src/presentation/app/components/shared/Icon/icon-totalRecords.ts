import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-totalRecords',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
            xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0"
            viewBox="0 0 32 32" style="enable-background:new 0 0 512 512" xml:space="preserve"
            class="">
            <g>
                <path
                    d="M25 2H7a1 1 0 0 0-1 1v26a1 1 0 0 0 1.555.832L10 28.202l2.445 1.63a1.001 1.001 0 0 0 1.11 0L16 28.202l2.445 1.63a1.001 1.001 0 0 0 1.11 0L22 28.202l2.445 1.63A1 1 0 0 0 26 29V3a1 1 0 0 0-1-1ZM12 8h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2Zm7 12h-7a1 1 0 0 1 0-2h7a1 1 0 0 1 0 2Zm2-5h-9a1 1 0 0 1 0-2h9a1 1 0 0 1 0 2Z"
                    fill="#4285F4" opacity="1" data-original="#000000" class=""></path>
            </g>
        </svg>
        </ng-template>
    `,
})
export class IconTotalRecordsComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
