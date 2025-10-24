import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { MenuDaum } from '../../models/menu.model';
import { LocalStorageService } from '../../../common/local-storage.service';
import { forEach } from 'mathjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConstant } from '../../../common/app-constant';
import { MenuService } from '../menu.service';

@Directive({
    selector: '[appIsGranted]'
})
export class IsGrantedDirective {
    menuItems: MenuDaum[] = [];
    isGrantedPermission: boolean = false;
    currentRoute: string = '';

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private localstorage: LocalStorageService,
        private activatedRoute: ActivatedRoute,
        private menuService: MenuService,
        private router: Router
    ) { }

    @Input() set appIsGranted(permission: any) {
        this.isGranted(permission);
    }
    private isGranted(permission: any) {
        this.isGrantedPermission = false; 

        this.menuItems = JSON.parse(this.localstorage.getSessionItem(AppConstant.GET_MENUS));

        if (!this.menuItems || this.menuItems.length === 0) {
            
            this.menuService.getMenu<MenuDaum[]>(AppConstant.GET_MENUS).subscribe({
                next: (response) => {
                    if (response && response.data) {
                        this.menuItems = response.data;
                        this.localstorage.setSession(AppConstant.GET_MENUS, JSON.stringify(response.data));
                        this.checkAndRender(permission); 
                    } else {
                        this.viewContainer.clear(); 
                    }
                },
                error: () => {
                    this.viewContainer.clear(); 
                }
            });
        } else {
            this.checkAndRender(permission);
        }
    }

    private checkAndRender(permission: any) {
        this.currentRoute = this.router.url;

        for (let item of this.menuItems) {
            if (item.class !== '' && item.subMenus) {
                for (let subMenu of item.subMenus) {
                    if (subMenu.link === this.currentRoute && subMenu.permissions.some(p => p.type === permission)) {
                        this.isGrantedPermission = true;
                        break;
                    }
                }
            } else if (item.link === this.currentRoute && item.permissions.some(p => p.type === permission)) {
                this.isGrantedPermission = true;
                break;
            }
        }

            
        if (this.isGrantedPermission) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }

}
