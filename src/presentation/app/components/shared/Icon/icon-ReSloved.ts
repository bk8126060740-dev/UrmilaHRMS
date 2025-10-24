import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-ReSloved',
    template: `
        <ng-template #template>

            <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
                xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0"
                viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve"
                class="">
                <g>
                    <path fill-rule="evenodd"
                        d="M237.4 512a59.057 59.057 0 0 1-58.327-51.267h116.704A59.11 59.11 0 0 1 237.4 512zm65.726-64.9h-131.4a33.7 33.7 0 0 1-33.667-33.64v-22.323h198.676v22.318a33.655 33.655 0 0 1-33.613 33.64zm-58.921-229.46h53.663a6.824 6.824 0 0 0 6.808-6.82 24.527 24.527 0 1 1 49.054 0 6.836 6.836 0 0 0 6.862 6.82h53.877c.054 1.19.054 2.4.054 3.586a176.837 176.837 0 0 1-63.206 135.6 39.951 39.951 0 0 0-13.242 20.674h-93.87v-42.38a38.168 38.168 0 0 0 0-75.113zm-6.809 55.4a6.821 6.821 0 0 1-6.808-6.819V217.64h-47.445a38.169 38.169 0 0 1-75.107 0H60.377c-.054 1.19-.054 2.385-.054 3.586a176.788 176.788 0 0 0 63.152 135.6 39.549 39.549 0 0 1 13.242 20.674h93.871v-48.588a6.821 6.821 0 0 1 6.808-6.819 24.527 24.527 0 1 0 0-49.053zm-6.808-111.423V204h-53.664a6.813 6.813 0 0 0-6.808 6.819 24.527 24.527 0 1 1-49.053 0 6.813 6.813 0 0 0-6.808-6.819H61.127C69.6 116.628 141.864 47.637 230.588 44.266V86.51a38.165 38.165 0 0 0 0 75.107zm20.321-81.808a24.548 24.548 0 0 1 24.5-24.537 6.816 6.816 0 0 0 6.808-6.819V0c88.457 3.356 160.991 71.773 169.461 159.736h-46.909a38.169 38.169 0 0 0-75.108 0h-47.445V111.15a6.823 6.823 0 0 0-6.808-6.82 24.537 24.537 0 0 1-24.499-24.521z"
                        fill="#B77BEF" opacity="1" data-original="#000000" class=""></path>
                </g>
            </svg>
        </ng-template>
    `,
})
export class IconReSlovedComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
