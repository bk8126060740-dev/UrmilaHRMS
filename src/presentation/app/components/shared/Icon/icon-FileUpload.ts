import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-FileUpload',
    template: `
        <ng-template #template>
            <svg xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="512" height="512" x="0" y="0"
                viewBox="0 0 48 48"
                style="enable-background:new 0 0 512 512"
                xml:space="preserve" class=""
                style="width: 16px !important; height:16px !important;">
                <g>
                    <path
                        d="M14.03 10.71h13.98v3H14.03z"
                        fill="currentColor" opacity="1"
                        data-original="#000000"
                        class=""></path>
                    <path
                        d="M3.5 14.13c0-.8.55-1.47 1.29-1.65v8.83c.74-.98 1.79-1.74 3-2.22V5.21h26.46V15.52h6.65c-.75-1.24-2.1-2.09-3.65-2.11v-9.7c0-.83-.67-1.5-1.5-1.5H6.29c-.83 0-1.5.67-1.5 1.5v5.76C2.39 9.68.5 11.68.5 14.13v21.95l3-11.61z"
                        fill="currentColor" opacity="1"
                        data-original="#000000"
                        class=""></path>
                    <path
                        d="M46.83 19.03c-.75-.96-2.01-1.51-3.46-1.51H31.8c-1.8 0-3.44 1.14-3.81 2.6-.06.12-.45.41-.94.41H10.59c-2.28 0-4.36 1.41-4.85 3.27L1.17 41.5c-.23.9-.08 1.82.4 2.54.63.99 1.78 1.62 3.16 1.72.15.01.31.03.46.03h31.65c2.47 0 4.74-1.52 5.27-3.54l5.28-20.43c.26-1 .06-1.99-.56-2.79z"
                        fill="currentColor" opacity="1"
                        data-original="#000000"
                        class=""></path>
                </g>
            </svg>
        </ng-template>
    `,
})
export class IconFileUploadComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
