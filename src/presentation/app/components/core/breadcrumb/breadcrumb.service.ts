import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, NavigationEnd, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbs$ = new BehaviorSubject<Array<{ label: string, url: string }>>([]);

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateBreadcrumbs(this.router.routerState.root.snapshot);
      }
    });

    
    this.updateBreadcrumbs(this.router.routerState.root.snapshot);
  }

  private updateBreadcrumbs(routeSnapshot: ActivatedRouteSnapshot, breadcrumbs: Array<{ label: string, url: string }> = [], url: string = ''): void {
    if (routeSnapshot.routeConfig?.path === '') {
      if (breadcrumbs.length === 0) {
        breadcrumbs.push({ label: 'Home', url: '/' });
      }
    } else {
      if (routeSnapshot.data['title']) {
        url = url ? `${url}/${routeSnapshot.routeConfig?.path}` : `/${routeSnapshot.routeConfig?.path}`;
        breadcrumbs.push({ label: routeSnapshot.data['title'], url: this.cleanUrl(url) });
      }
    }

    if (routeSnapshot.firstChild) {
      this.updateBreadcrumbs(routeSnapshot.firstChild, breadcrumbs, url);
    } else {
      this.breadcrumbs$.next(breadcrumbs);
    }
  }

  private cleanUrl(url: string): string {
    return url.replace(/\/{2,}/g, '/').replace(/\/$/, '');
  }

  getBreadcrumbs() {
    return this.breadcrumbs$.asObservable();
  }
}
