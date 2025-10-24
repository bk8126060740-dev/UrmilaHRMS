import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-user',
    template: `
        <ng-template #template>
       
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M256 292.1c33 0 63.5-9.3 87.9-25.1 18.9-12.1 43.5-10.1 60.1 5 46.1 41.8 72.3 101.1 72.2 163.4v26.7c0 27.6-22.4 49.9-50 49.9H85.8c-27.6 0-50-22.3-50-49.9v-26.7c-.2-62.2 26-121.6 72.1-163.3 16.6-15.1 41.3-17.1 60.1-5 24.5 15.7 54.9 25 88 25z" fill="currentColor" opacity="1" data-original="#000000" class=""></path><circle cx="256" cy="123.8" r="123.8" fill="currentColor" opacity="1" data-original="#000000" class=""></circle></g></svg>

        </ng-template>
    `,
})
export class IconUserComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
