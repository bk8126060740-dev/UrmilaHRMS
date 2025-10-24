import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-TextFile',
    template: `
        <ng-template #template>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="16px" height="16px" x="0" y="0"
            viewBox="0 0 24 24"
            style="enable-background:new 0 0 512 512"
            xml:space="preserve" class="">
            <g>
                <g data-name="Layer 2">
                    <path
                        d="M16 8.75A1.76 1.76 0 0 1 14.25 7V1.25H5A1.76 1.76 0 0 0 3.25 3v18A1.76 1.76 0 0 0 5 22.75h14A1.76 1.76 0 0 0 20.75 21V8.75zm-8 .5h4a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1 0-1.5zm8 9.5H8a.75.75 0 0 1 0-1.5h8a.75.75 0 0 1 0 1.5zm0-4H8a.75.75 0 0 1 0-1.5h8a.75.75 0 0 1 0 1.5z"
                        fill="currentColor" opacity="1"
                        data-original="#000000"
                        class=""></path>
                    <path
                        d="M16 7.25h4.34l-4.46-5.37a1.42 1.42 0 0 0-.13-.12V7a.25.25 0 0 0 .25.25z"
                        fill="currentColor" opacity="1"
                        data-original="#000000"
                        class=""></path>
                </g>
            </g>
        </svg>
        </ng-template>
    `,
})
export class IconTextFileComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
