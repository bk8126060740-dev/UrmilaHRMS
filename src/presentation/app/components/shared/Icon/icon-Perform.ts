import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-Perform',
    template: `
        <ng-template #template>
       <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class="hovered-paths"><g><path d="M201 60h110c8.284 0 15-6.716 15-15V30c0-16.569-13.431-30-30-30h-80c-16.569 0-30 13.431-30 30v15c0 8.284 6.716 15 15 15zM267.103 164.909l-9.693 25.447h19.296zM151 330h30v90h-30z" fill="currentColor" opacity="1" data-original="#000000" class="hovered-path"></path><path d="M406 40h-50v5c0 24.853-20.147 45-45 45H201c-24.853 0-45-20.147-45-45v-5h-50c-24.853 0-45 20.147-45 45v382c0 24.853 20.147 45 45 45h300c24.853 0 45-20.147 45-45V85c0-24.853-20.147-45-45-45zM211 435c0 8.284-6.716 15-15 15h-60c-8.284 0-15-6.716-15-15V315c0-8.284 6.716-15 15-15h60c8.284 0 15 6.716 15 15zm-40-205c-27.57 0-50-22.43-50-50s22.43-50 50-50c10.019 0 19.688 2.955 27.962 8.545 4.576 3.092 5.78 9.308 2.688 13.884-3.091 4.576-9.308 5.78-13.884 2.688A29.84 29.84 0 0 0 171 150c-16.542 0-30 13.458-30 30s13.458 30 30 30c13.808 0 20.822-9.399 23.374-20h-12.775c-5.523 0-10-4.477-10-10s4.477-10 10-10h23.932c5.523 0 10 4.477 10 10-.001 29.439-18.313 50-44.531 50zm60.86-.655c-5.161-1.966-7.752-7.743-5.786-12.904l30.04-78.873A11.771 11.771 0 0 1 267.126 130h.012a11.772 11.772 0 0 1 11.032 7.592l29.767 78.876c1.95 5.167-.657 10.937-5.824 12.887-5.172 1.95-10.938-.658-12.887-5.825l-4.972-13.174h-34.461l-5.029 13.203a10.004 10.004 0 0 1-9.347 6.444 9.955 9.955 0 0 1-3.557-.658zM376 450H256c-8.284 0-15-6.716-15-15s6.716-15 15-15h120c8.284 0 15 6.716 15 15s-6.716 15-15 15zm0-60H256c-8.284 0-15-6.716-15-15s6.716-15 15-15h120c8.284 0 15 6.716 15 15s-6.716 15-15 15zm0-60H256c-8.284 0-15-6.716-15-15s6.716-15 15-15h120c8.284 0 15 6.716 15 15s-6.716 15-15 15zm-18.019-134.848c-2.834 0-7.783.021-12.275.044V220c0 5.523-4.478 10-10 10s-10-4.477-10-10v-80h.001a9.995 9.995 0 0 1 9.999-10h22.275C376.188 130 391 144.614 391 162.576s-14.812 32.576-33.019 32.576z" fill="currentColor" opacity="1" data-original="#000000" class="hovered-path"></path><path d="M357.981 150h-12.246c.014 4.833.048 20.57.071 25.196 4.467-.022 9.35-.043 12.175-.043 7.057 0 13.019-5.759 13.019-12.576S365.038 150 357.981 150z" fill="currentColor" opacity="1" data-original="#000000" class="hovered-path"></path></g></svg>
        </ng-template>
    `,
})
export class IconPerformComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
