import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-notification',
    template: `
        <ng-template #template>
        <svg class=" setting-icn" xmlns="http://www.w3.org/2000/svg" version="1.1"
                            xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" x="0" y="0"
                            viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve" class="">
                            <g>
                                <path
                                    d="M22 10.882a1 1 0 0 1-1-1c0-2.805-1.092-5.441-3.075-7.425a.999.999 0 1 1 1.414-1.414A12.418 12.418 0 0 1 23 9.882a1 1 0 0 1-1 1zM2 10.882a1 1 0 0 1-1-1c0-3.339 1.3-6.478 3.661-8.839a.999.999 0 1 1 1.414 1.414A10.432 10.432 0 0 0 3 9.882a1 1 0 0 1-1 1zM21.379 16.913A6.698 6.698 0 0 1 19 11.788V9c0-3.519-2.614-6.432-6-6.92V1a1 1 0 1 0-2 0v1.08C7.613 2.568 5 5.481 5 9v2.788a6.705 6.705 0 0 1-2.388 5.133A1.752 1.752 0 0 0 3.75 20h16.5c.965 0 1.75-.785 1.75-1.75 0-.512-.223-.996-.621-1.337zM12 24a3.756 3.756 0 0 0 3.674-3H8.326A3.756 3.756 0 0 0 12 24z"
                                    fill="currentColor" opacity="1" data-original="currentColor" class=""></path>
                            </g>
                        </svg>
        </ng-template>
    `,
})
export class IconNotificationComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
