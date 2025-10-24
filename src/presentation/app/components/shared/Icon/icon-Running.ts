import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-Running',
    template: `
        <ng-template #template>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
            xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0"
            viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve"
            class="">
            <g>
                <path
                    d="M22.703 19.469c.02-.155.047-.309.047-.469 0-.161-.028-.314-.047-.469l.901-.682a.5.5 0 0 0 .131-.649l-.809-1.4a.5.5 0 0 0-.627-.211l-1.037.437a3.715 3.715 0 0 0-.819-.487l-.138-1.101a.5.5 0 0 0-.496-.438h-1.617a.5.5 0 0 0-.496.438l-.138 1.101a3.731 3.731 0 0 0-.819.487l-1.037-.437a.5.5 0 0 0-.627.211l-.809 1.4a.5.5 0 0 0 .131.649l.901.682c-.02.155-.047.309-.047.469 0 .161.028.314.047.469l-.901.682a.5.5 0 0 0-.131.649l.809 1.401a.5.5 0 0 0 .627.211l1.037-.438c.253.193.522.363.819.487l.138 1.101c.031.25.243.438.495.438h1.617a.5.5 0 0 0 .496-.438l.138-1.101c.297-.124.567-.295.819-.487l1.037.437a.5.5 0 0 0 .627-.211l.809-1.401a.5.5 0 0 0-.131-.649zM19 21a2 2 0 1 1-.001-3.999A2 2 0 0 1 19 21zM19 0H3a3 3 0 1 0 0 6h16a3 3 0 1 0 0-6zM3 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM19 8H3c-1.66 0-3 1.34-3 3s1.34 3 3 3h11.09c.51-.36 1.15-.52 1.78-.42.37-.93 1.28-1.58 2.32-1.58h1.62c.65 0 1.24.25 1.69.66.31-.48.5-1.05.5-1.66 0-1.66-1.34-3-3-3zM3 12c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM12.74 19c-.629-.802-.765-1.875-.09-3H3c-1.66 0-3 1.34-3 3s1.34 3 3 3h9.65c-.674-1.123-.54-2.197.09-3zM3 20c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"
                    fill="#B77BEF" opacity="1" data-original="#fff" class=""></path>
            </g>
        </svg>
        </ng-template>
    `,
})
export class IconRunningComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
