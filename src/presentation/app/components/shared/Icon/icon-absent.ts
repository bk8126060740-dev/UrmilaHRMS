import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-absent',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" width="18px" height="18px" x="0"
                                            y="0" viewBox="0 0 64 64" style="enable-background:new 0 0 512 512"
                                            xml:space="preserve" class="">
                                            <g>
                                                <circle cx="29" cy="18.1" r="10.1" fill="#F26622" opacity="1"
                                                    data-original="#000000" class=""></circle>
                                                <path
                                                    d="M29 52a23 23 0 1 1 23-23 21.088 21.088 0 0 1-.32 3.75 14.248 14.248 0 0 1 1.9.77A24.132 24.132 0 0 0 54 29a25 25 0 1 0-25 25 24.129 24.129 0 0 0 4.52-.42 14.248 14.248 0 0 1-.77-1.9A21.093 21.093 0 0 1 29 52Z"
                                                    fill="#F26622" opacity="1" data-original="#000000" class=""></path>
                                                <path
                                                    d="M45.27 32.1a8.493 8.493 0 0 0-3.7-2.44l-4.91-1.64a1.03 1.03 0 0 0-.35-.06 1.015 1.015 0 0 0-.57.18 12.08 12.08 0 0 1-13.48 0 1.016 1.016 0 0 0-.97-.1l-4.86 1.62a8.647 8.647 0 0 0-5.91 8.2c.03.33-.09 1.05.13 1.34A21.04 21.04 0 0 0 29 50a20.653 20.653 0 0 0 3.25-.26A15.43 15.43 0 0 1 32 47a15.025 15.025 0 0 1 13.27-14.9Z"
                                                    fill="#F26622" opacity="1" data-original="#000000" class=""></path>
                                                <circle cx="47" cy="47" r="1" fill="#F26622" opacity="1"
                                                    data-original="#000000" class=""></circle>
                                                <path
                                                    d="M47 34a13 13 0 1 0 13 13 13.012 13.012 0 0 0-13-13Zm6 14h-3.18A2.995 2.995 0 1 1 46 44.18V38.6a1 1 0 0 1 2 0v5.58A3.035 3.035 0 0 1 49.82 46H53a1 1 0 0 1 0 2Z"
                                                    fill="#F26622" opacity="1" data-original="#000000" class=""></path>
                                            </g>
                                        </svg>
        </ng-template>
    `,
})
export class IconAbsentComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
