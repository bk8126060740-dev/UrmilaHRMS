import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-fileDownload',
    template: `
        <ng-template #template>
        <i class="fa-solid fa-file-arrow-down cursor" style="color: #59AAAA; font-size: 18px;"></i>
        </ng-template>
    `,
})
export class IconFileDownloadComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
