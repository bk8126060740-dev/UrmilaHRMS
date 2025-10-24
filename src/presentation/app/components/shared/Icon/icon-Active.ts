import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-Active',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0"
                                    viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve"
                                    fill-rule="evenodd" class="">
                                    <g>
                                        <circle cx="11.5" cy="6.744" r="5.5" fill="#59AAAA" opacity="1"
                                            data-original="#000000"></circle>
                                        <path
                                            d="M12.925 21.756A6.226 6.226 0 0 1 11.25 17.5c0-1.683.667-3.212 1.751-4.336-.49-.038-.991-.058-1.501-.058-3.322 0-6.263.831-8.089 2.076-1.393.95-2.161 2.157-2.161 3.424v1.45a1.697 1.697 0 0 0 1.7 1.7z"
                                            fill="#59AAAA" opacity="1" data-original="#000000"></path>
                                        <path
                                            d="M17.5 12.25c-2.898 0-5.25 2.352-5.25 5.25s2.352 5.25 5.25 5.25 5.25-2.352 5.25-5.25-2.352-5.25-5.25-5.25zm-2.416 6.124 1.5 1a.75.75 0 0 0 .946-.094l2.5-2.5a.749.749 0 1 0-1.06-1.06l-2.066 2.065-.988-.659a.75.75 0 0 0-.832 1.248z"
                                            fill="#59AAAA" opacity="1" data-original="#000000"></path>
                                    </g>
                                </svg>
        </ng-template>
    `,
})
export class IconActiveComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
