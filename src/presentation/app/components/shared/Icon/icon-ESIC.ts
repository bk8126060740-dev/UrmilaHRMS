import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-ESIC',
    template: `
        <ng-template #template>
        <svg width="15" height="15"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            version="1.1"
                                                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                            x="0" y="0" viewBox="0 0 512.019 512.019"
                                                                            style="enable-background:new 0 0 512 512"
                                                                            xml:space="preserve" class="">
                                                                            <g>
                                                                                <path
                                                                                    d="M372.01 224c-48.52 0-88 39.48-88 88s39.48 88 88 88 88-39.48 88-88-39.48-88-88-88zm37.31 73.88c-25.581 38.377-18.327 27.497-32 48-4.911 7.366-14.854 9.32-22.19 4.43l-24-16c-7.35-4.9-9.33-14.83-4.43-22.19 4.9-7.35 14.83-9.33 22.19-4.43l10.68 7.12c25.518-38.271 24.146-37.212 28.44-39.66 14.573-8.43 30.675 8.664 21.31 22.73zM300.01 407.94V496c0 12.259 13.278 19.985 23.94 13.89l48.06-27.46 48.06 27.46c10.619 6.086 23.94-1.597 23.94-13.89v-88.06c-42.628 32.072-101.311 32.118-144 0zm104-211.6V34.75C404.01 15.59 388.42 0 369.26 0H86.76C67.6 0 52.01 15.59 52.01 34.75v370.5c0 19.16 15.59 34.75 34.75 34.75h181.25c0-68.853-.107-64.591.25-67.76-53.562-91.827 31.727-204.788 135.75-175.9zM148.01 80h136c8.84 0 16 7.16 16 16s-7.16 16-16 16h-136c-8.84 0-16-7.16-16-16s7.16-16 16-16zm80 160h-80c-8.84 0-16-7.16-16-16s7.16-16 16-16h80c8.84 0 16 7.16 16 16s-7.16 16-16 16zm-80-64c-8.84 0-16-7.16-16-16s7.16-16 16-16h136c8.84 0 16 7.16 16 16s-7.16 16-16 16z"
                                                                                    fill="currentColor" opacity="1"
                                                                                    data-original="#000000" class="">
                                                                                </path>
                                                                            </g>
                                                                        </svg>
        </ng-template>
    `,
})
export class IconESICComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
