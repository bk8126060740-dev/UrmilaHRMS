import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-menu-recruitment',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
            xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0"
            viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve"
            class="hovered-paths">
            <g>
                <path
                    d="M469.333 106.667H362.667V85.333c0-23.531-19.135-42.667-42.667-42.667H192c-23.531 0-42.667 19.135-42.667 42.667v21.333H42.667C19.135 106.667 0 125.802 0 149.333v64C0 236.865 19.135 256 42.667 256h170.667v-10.667a10.66 10.66 0 0 1 10.667-10.667h64a10.66 10.66 0 0 1 10.667 10.667V256h170.667c23.53 0 42.665-19.135 42.665-42.667v-64c0-23.531-19.135-42.666-42.667-42.666zm-149.333 0H192V85.333h128v21.334zM506.083 267.51a10.68 10.68 0 0 0-11.188 1.052c-7.583 5.74-16.417 8.771-25.563 8.771H298.667v32A10.66 10.66 0 0 1 288 320h-64a10.66 10.66 0 0 1-10.667-10.667v-32H42.667c-9.146 0-17.979-3.031-25.563-8.771a10.593 10.593 0 0 0-11.188-1.052A10.666 10.666 0 0 0 0 277.063v149.604c0 23.531 19.135 42.667 42.667 42.667h426.667c23.531 0 42.667-19.135 42.667-42.667V277.063a10.668 10.668 0 0 0-5.918-9.553z"
                    fill="currentColor" opacity="1" data-original="#000000" class="hovered-path">
                </path>
            </g>
        </svg>
        </ng-template>
    `,
})
export class IconRecruitmentComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
