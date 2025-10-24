import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-menu-employee',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
                                xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0"
                                viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve"
                                class="">
                                <g>
                                    <circle cx="195" cy="130" r="100" fill="currnetColor" opacity="1"
                                        data-original="#000000" class=""></circle>
                                    <path
                                        d="M206.875 320h-23.75l-12.407 92.636L195 442.988l24.282-30.352zM182.707 290h24.586l5-30h-34.586z"
                                        fill="currnetColor" opacity="1" data-original="#000000" class=""></path>
                                    <path
                                        d="m140.133 415.009 14.701-109.766L147.293 260H120C53.726 260 0 313.726 0 380v87c0 8.284 6.716 15 15 15h172.791l-44.504-55.63a14.997 14.997 0 0 1-3.154-11.361zM297.561 263.201A120.104 120.104 0 0 0 270 260h-27.293l-7.54 45.243 14.701 109.766a15 15 0 0 1-3.154 11.362L202.209 482h77.832C270.603 469.456 265 453.871 265 437V325c0-25.614 12.911-48.263 32.561-61.799zM467 280h-8.5v-25c0-19.299-15.701-35-35-35h-40c-19.299 0-35 15.701-35 35v25H340c-24.853 0-45 20.147-45 45v10h217v-10c0-24.853-20.147-45-45-45zm-38.5 0h-50v-25c0-2.757 2.243-5 5-5h40c2.757 0 5 2.243 5 5zM295 437c0 24.853 20.147 45 45 45h127c24.853 0 45-20.147 45-45v-72H295z"
                                        fill="currnetColor" opacity="1" data-original="#000000" class=""></path>
                                </g>
                            </svg>
        </ng-template>
    `,
})
export class IconEmployeeComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
