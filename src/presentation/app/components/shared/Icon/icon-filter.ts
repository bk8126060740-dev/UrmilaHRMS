import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-filter',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" x="0" y="0" viewBox="0 0 20 20" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><g fill="#000"><path d="M0 5a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1zM3 10a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zM8 14a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2z" fill="#ffffff" opacity="1" data-original="#000000" class=""></path></g></g></svg>
        </ng-template>
    `,
})
export class IconFilterComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
