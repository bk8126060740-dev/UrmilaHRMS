import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-ManageColumns',
    template: `
        <ng-template #template>
        <svg fill="none" height="25" viewBox="0 0 24 24" width="30"
            xmlns="http://www.w3.org/2000/svg" id="fi_9741124">
            <g fill="#5b6283">
                <path
                    d="m21 20.25h-10c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h10c.41 0 .75.34.75.75s-.34.75-.75.75z">
                </path>
                <path
                    d="m21 13.25h-10c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h10c.41 0 .75.34.75.75s-.34.75-.75.75z">
                </path>
                <path
                    d="m21 6.25h-10c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h10c.41 0 .75.34.75.75s-.34.75-.75.75z">
                </path>
                <path
                    d="m4.00043 7.24994c-.19 0-.38-.07-.53-.22l-1-1c-.29-.29-.29-.77 0-1.06s.77-.29 1.06 0l.47.47 2.47-2.47c.29-.29.77-.29 1.06 0s.29.77 0 1.06l-3 3c-.15.15-.34.22-.53.22z">
                </path>
                <path
                    d="m4.00043 14.2499c-.19 0-.38-.07-.53-.22l-1-1c-.29-.29-.29-.77 0-1.06s.77-.29 1.06 0l.47.47 2.47-2.46996c.29-.29.77-.29 1.06 0 .29.28996.29.76996 0 1.05996l-3 3c-.15.15-.34.22-.53.22z">
                </path>
                <path
                    d="m4.00043 21.2499c-.19 0-.38-.07-.53-.22l-1-1c-.29-.29-.29-.77 0-1.06s.77-.29 1.06 0l.47.47 2.47-2.47c.29-.29.77-.29 1.06 0s.29.77 0 1.06l-3 3c-.15.15-.34.22-.53.22z">
                </path>
            </g>
        </svg>
        </ng-template>
    `,
})
export class IconManageColumnsComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
