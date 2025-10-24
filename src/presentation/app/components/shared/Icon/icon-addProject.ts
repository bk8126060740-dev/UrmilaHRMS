import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-addProject',
    template: `
        <ng-template #template>
            <svg class="cursor" height="14px"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="512" height="512" x="0" y="0"
                viewBox="0 0 32 32"
                style="enable-background:new 0 0 512 512"
                xml:space="preserve">
                <g>
                    <path
                        d="M21.878 2.464A4.99 4.99 0 0 0 21 1.775V7a1 1 0 0 0 1 1h5.225a4.99 4.99 0 0 0-.689-.878z"
                        fill="currentColor" opacity="1"
                        data-original="#000000" class="">
                    </path>
                    <path
                        d="M22 10a3.009 3.009 0 0 1-3-3V1.06c-.22-.02-.43-.06-.66-.06H9a5 5 0 0 0-5 5v20a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V10.66c0-.23-.04-.44-.06-.66zm-2 8h-3v3a1 1 0 0 1-2 0v-3h-3a1 1 0 0 1 0-2h3v-3a1 1 0 0 1 2 0v3h3a1 1 0 0 1 0 2z"
                        fill="currentColor" opacity="1"
                        data-original="#000000" class="">
                    </path>
                </g>
            </svg>
        </ng-template>
    `,
})
export class IconAddProjectComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
