import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-CheckIn',
    template: `
        <ng-template #template>
            <svg xmlns="http://www.w3.org/2000/svg" class="me-2" version="1.1"
                xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" x="0" y="0"
                viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve" class="">
                <g>
                    <path
                        d="M22 12.75a.75.75 0 0 1-.75-.75A9.25 9.25 0 0 0 5.459 5.459a9.427 9.427 0 0 0-.862.993.75.75 0 0 1-1.2-.9 11.235 11.235 0 0 1 1-1.15A10.75 10.75 0 0 1 22.75 12a.75.75 0 0 1-.75.75zM12 22.75A10.748 10.748 0 0 1 1.25 12a.75.75 0 0 1 1.5 0 9.25 9.25 0 0 0 15.791 6.541 9.331 9.331 0 0 0 .861-.992.751.751 0 0 1 1.2.9 11.087 11.087 0 0 1-1 1.151A10.684 10.684 0 0 1 12 22.75z"
                        fill="#fff" opacity="1" data-original="#000000" class=""></path>
                    <path
                        d="M20.485 21.235a.75.75 0 0 1-.75-.75v-2.078h-2.079a.75.75 0 0 1 0-1.5h2.829a.75.75 0 0 1 .75.75v2.828a.75.75 0 0 1-.75.75zM6.343 7.093H3.515a.75.75 0 0 1-.75-.75V3.515a.75.75 0 0 1 1.5 0v2.078h2.078a.75.75 0 0 1 0 1.5zM12 5.25A6.75 6.75 0 1 0 18.75 12 6.758 6.758 0 0 0 12 5.25zm2.5 7.5H12a.75.75 0 0 1-.75-.75V9a.75.75 0 0 1 1.5 0v2.25h1.75a.75.75 0 0 1 0 1.5z"
                        fill="#fff" opacity="1" data-original="#000000" class=""></path>
                </g>
            </svg>
        </ng-template>
    `,
})
export class IconCheckInComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
