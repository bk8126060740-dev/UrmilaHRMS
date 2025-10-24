import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-menu-compliance',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve" class="hovered-paths"><g><path d="M10.75 12.77c0-.86.47-1.63 1.23-2.01l2-1.02c.32-.16.67-.24 1.02-.24h2.75V5c0-1.52-1.23-2.75-2.75-2.75H6C4.48 2.25 3.25 3.48 3.25 5v13c0 1.52 1.23 2.75 2.75 2.75h6.86a7.887 7.887 0 0 1-2.11-5.37zM6 5.25h7a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1 0-1.5zm3 7.5H6a.75.75 0 0 1 0-1.5h3a.75.75 0 0 1 0 1.5zm1-3H6a.75.75 0 0 1 0-1.5h4a.75.75 0 0 1 0 1.5zm11.34 2.346-2-1.015A.756.756 0 0 0 19 11h-4a.76.76 0 0 0-.34.081l-2 1.015a.75.75 0 0 0-.41.669v2.618c0 2.657 1.66 5.07 4.134 6.005a1.734 1.734 0 0 0 1.235-.001c2.471-.934 4.131-3.347 4.131-6.004v-2.618a.75.75 0 0 0-.41-.669zm-2.28 3.142-1.8 2.015a.753.753 0 0 1-1.12 0l-1.2-1.344a.75.75 0 0 1 1.12-.999l.641.717 1.24-1.389a.75.75 0 0 1 1.12.999z" fill="currentColor" opacity="1" data-original="#000000" class="hovered-path"></path></g></svg>
        </ng-template>
    `,
})
export class IconComplianceComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
