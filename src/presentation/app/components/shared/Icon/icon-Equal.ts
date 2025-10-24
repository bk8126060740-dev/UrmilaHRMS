import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-Equal',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" x="0" y="0" viewBox="0 0 300 300" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M240.3 125.5H59.7c-11.9 0-21.5-9.6-21.5-21.5s9.6-21.5 21.5-21.5h180.6c11.9 0 21.5 9.6 21.5 21.5s-9.6 21.5-21.5 21.5zM240.3 221.5H59.7c-11.9 0-21.5-9.6-21.5-21.5s9.6-21.5 21.5-21.5h180.6c11.9 0 21.5 9.6 21.5 21.5s-9.6 21.5-21.5 21.5z" fill="currentColor" opacity="1" data-original="#000000" class=""></path></g></svg>
        </ng-template>
    `,
})
export class IconEqualComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
