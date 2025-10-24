import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-Pending',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
            xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0"
            viewBox="0 0 409.6 409.6" style="enable-background:new 0 0 512 512"
            xml:space="preserve" class="">
            <g>
                <path
                    d="M307.2 238.935c-47.114 0-85.335 38.2-85.335 85.33 0 47.119 38.221 85.335 85.335 85.335s85.335-38.216 85.335-85.335c0-47.13-38.221-85.33-85.335-85.33zm51.2 98.13h-64v-64H320v38.4h38.4v25.6z"
                    fill="#ffa75d" opacity="1" data-original="#000000" class=""></path>
                <path
                    d="M290.135 0H51.2C32.435 0 17.065 15.365 17.065 34.135v307.2c0 18.765 15.37 34.13 34.135 34.13h136.535v-51.2c0-65.864 53.601-119.465 119.465-119.465h17.065V34.135C324.265 15.365 308.9 0 290.135 0zM68.265 51.2h170.67v34.135H68.265V51.2zm68.27 238.935h-68.27V256h68.27v34.135zm34.13-68.27h-102.4v-34.13h102.4v34.13zm102.4-68.265h-204.8v-34.135h204.8V153.6z"
                    fill="#ffa75d" opacity="1" data-original="#000000" class=""></path>
            </g>
        </svg>
        </ng-template>
    `,
})
export class IconPendingComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
