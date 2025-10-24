import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-Approved',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22" x="0" y="0" viewBox="0 0 32 32" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M2 22c0 2.21 1.79 4 4 4h20c2.21 0 4-1.79 4-4v-8.5H2zm10.97-2H14c.55 0 1 .45 1 1s-.45 1-1 1h-1.03c-.55 0-1-.45-1-1s.45-1 1-1zM7 20h3.03c.55 0 1 .45 1 1s-.45 1-1 1H7c-.55 0-1-.45-1-1s.45-1 1-1zM26 6H6c-2.21 0-4 1.79-4 4v1.5h28V10c0-2.21-1.79-4-4-4z" fill="currentColor" opacity="1" data-original="#000000" class=""></path></g></svg>
        </ng-template>
    `,
})
export class IconApprovedComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
