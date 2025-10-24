import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-holiday',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" width="15px" height="15px" x="0"
                                            y="0" viewBox="0 0 32 32" style="enable-background:new 0 0 512 512"
                                            xml:space="preserve" class="">
                                            <g>
                                                <path
                                                    d="M8 2v1H6V2c0-.55.45-1 1-1s1 .45 1 1zm8-1c-.55 0-1 .45-1 1v1h2V2c0-.55-.45-1-1-1zm9 0c-.55 0-1 .45-1 1v1h2V2c0-.55-.45-1-1-1zm3 2h-2v1c0 .55-.45 1-1 1s-1-.45-1-1V3h-7v1c0 .55-.45 1-1 1s-1-.45-1-1V3H8v1c0 .55-.45 1-1 1s-1-.45-1-1V3H4C2.35 3 1 4.35 1 6v3h30V6c0-1.65-1.35-3-3-3zm3 8v17c0 1.654-1.346 3-3 3H4c-1.654 0-3-1.346-3-3V11zM19 22.286l3-3.428h-4.287L16 15l-1.713 3.858H10l3 3.428L11.713 27 16 24.43 20.287 27z"
                                                    fill="#1B84FF" opacity="1" data-original="#000000" class=""></path>
                                            </g>
                                        </svg>
        </ng-template>
    `,
})
export class IconHolidayComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
