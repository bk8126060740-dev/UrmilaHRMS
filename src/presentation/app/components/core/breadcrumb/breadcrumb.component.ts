import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
	breadcrumbs: Array<{ label: string, url: string }> = [];

	constructor(private breadcrumbService: BreadcrumbService) { }

	ngOnInit(): void {
		this.breadcrumbService.getBreadcrumbs().subscribe(breadcrumbs => {
			this.breadcrumbs = breadcrumbs;
		});
	}

}

