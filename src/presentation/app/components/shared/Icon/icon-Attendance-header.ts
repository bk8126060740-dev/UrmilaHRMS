import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-AttendanceHeader',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
            width="16px" height="16px" x="0" y="0" viewBox="0 0 24 24"
            style="enable-background:new 0 0 512 512" xml:space="preserve" fill-rule="evenodd" class="">
            <g>
                <path
                    d="M6.75 2v3.5a.75.75 0 0 0 1.5 0V2a.75.75 0 0 0-1.5 0zM15.75 2v3.5a.75.75 0 0 0 1.5 0V2a.75.75 0 0 0-1.5 0z"
                    fill="curreColor" opacity="1" data-original="#000000" class=""></path>
                <path
                    d="M22.75 14.109V10.5H1.25v8.25A3.75 3.75 0 0 0 5 22.5h8.751a6.244 6.244 0 0 1-2.501-5 6.254 6.254 0 0 1 6.25-6.25c2.2 0 4.136 1.139 5.25 2.859zM9.25 3v2.5A1.75 1.75 0 0 1 7 7.177V3H5a3.75 3.75 0 0 0-3.75 3.75V9h21.5V6.75A3.75 3.75 0 0 0 19 3h-.75v2.5A1.75 1.75 0 0 1 16 7.177V3z"
                    fill="curreColor" opacity="1" data-original="#000000" class=""></path>
                <path
                    d="M17.5 12.25c-2.898 0-5.25 2.352-5.25 5.25s2.352 5.25 5.25 5.25 5.25-2.352 5.25-5.25-2.352-5.25-5.25-5.25zm-2.53 5.53 1.5 1.5a.749.749 0 0 0 1.06 0l2.5-2.5a.749.749 0 1 0-1.06-1.06L17 17.689l-.97-.969a.749.749 0 1 0-1.06 1.06z"
                    fill="currentColor" opacity="1" data-original="#000000" class=""></path>
            </g>
        </svg>
        </ng-template>
    `,
})
export class IconAttendanceHeaderComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
