import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-menu-master',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
            xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0"
            viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve"
            class="">
            <g>
                <path
                    d="M11.86 9.93h.01l4.9-1.67c.02-.09.02-.18.02-.26a.69.69 0 0 0-.04-.25c-.08-.23-.23-.48-.44-.66V4.9c0-1.62-.58-2.26-1.18-2.63C14.82 1.33 13.53 0 11 0 8 0 5.74 2.97 5.74 4.9c0 .8-.03 1.43-.06 1.91 0 .1-.01.19-.01.27-.22.2-.37.47-.44.73-.01.06-.02.12-.02.19 0 .78.44 1.91.5 2.04.06.17.19.31.36.39.01.04.02.1.02.22 0 1.06.91 2.06 1.41 2.54-.05 1.1-.36 1.86-.8 2.05l-3.92 1.3a3.406 3.406 0 0 0-2.23 2.41l-.53 2.12a.754.754 0 0 0 .73.93h11.21c-.3-.38-.58-.8-.84-1.25a8.51 8.51 0 0 1-1.12-4.2v-4.01c0-1.18.75-2.22 1.86-2.61z"
                    fill="currentColor" opacity="1" data-original="#000000" class=""></path>
                <path
                    d="m23.491 11.826-5.25-1.786a.737.737 0 0 0-.482 0l-5.25 1.786a.748.748 0 0 0-.509.71v4.018c0 4.904 5.474 7.288 5.707 7.387a.754.754 0 0 0 .586 0c.233-.1 5.707-2.483 5.707-7.387v-4.018a.748.748 0 0 0-.509-.71zm-2.205 3.792-2.75 3.5a1 1 0 0 1-1.437.142l-1.75-1.5a1 1 0 1 1 1.301-1.518l.958.821 2.105-2.679a.998.998 0 0 1 1.404-.168.996.996 0 0 1 .169 1.402z"
                    fill="currentColor" opacity="1" data-original="#000000" class=""></path>
            </g>
        </svg>
        </ng-template>
    `,
})
export class IconMasterComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
