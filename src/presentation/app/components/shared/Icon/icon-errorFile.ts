import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-errorFile',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path fill="currentColor" fill-rule="evenodd" d="M12.5 1a.5.5 0 0 1 .5.5V6a3 3 0 0 0 3 3h4.5a.5.5 0 0 1 .5.5V20a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3zm.5 11a1 1 0 1 0-2 0v3.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l3-3a1 1 0 0 0-1.414-1.414L13 15.586zm2-10.828c0-.095.077-.172.172-.172a2 2 0 0 1 1.414.586l3.828 3.828A2 2 0 0 1 21 6.828a.172.172 0 0 1-.172.172H16a1 1 0 0 1-1-1z" clip-rule="evenodd" opacity="1" data-original="#000000" class=""></path></g></svg>
        </ng-template>
    `,
})
export class IconErrorFileComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
