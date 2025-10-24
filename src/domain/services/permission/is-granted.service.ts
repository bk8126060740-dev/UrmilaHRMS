import { Injectable, TemplateRef, ViewContainerRef } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { MenuDaum } from "../../models/menu.model";
import { LocalStorageService } from "../../../common/local-storage.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AppConstant } from "../../../common/app-constant";
import { MenuService } from "../menu.service";

@Injectable({
    providedIn: 'root'
})

export class GrantPermissionService {

    menuItems: MenuDaum[] = [];
    isGrantedPermission: boolean = false;
    currentRoute: string = '';

            
    private userPermissions: string[] = ['read', 'write'];  


    constructor(
        private localstorage: LocalStorageService,
        private menuService: MenuService,
        private router: Router
    ) { }
        
    hasPermission(permission: string): Observable<boolean> {
        
        this.isGrantedPermission = false;
        this.menuItems = JSON.parse(this.localstorage.getSessionItem(AppConstant.GET_MENUS));

        this.currentRoute = this.router.url;

        for (let i = 0; i < this.menuItems.length; i++) {
            let item = this.menuItems[i];
            if (item.class === '') {
                if (item.link == this.currentRoute) {
                    for (let k = 0; k < item.permissions.length; k++) {
                        const permissions = item.permissions[k];
                        if (permissions.type == permission) {
                            this.isGrantedPermission = true;
                            break;
                        }
                    }
                }
            } else {
                for (let j = 0; j < item.subMenus.length; j++) {
                    const subMenus = item.subMenus[j];
                    if (subMenus.link == this.currentRoute) {
                        for (let k = 0; k < subMenus.permissions.length; k++) {
                            const permissions = subMenus.permissions[k];
                            if (permissions.type == permission) {
                                this.isGrantedPermission = true;
                                break;
                            }
                        }
                    }
                }
            }
        }

        return of(this.isGrantedPermission);
    }

    hasSpecialPermission(permission: string, screenId: number): Observable<boolean> {
        this.isGrantedPermission = false;
        this.menuItems = JSON.parse(this.localstorage.getSessionItem(AppConstant.GET_MENUS));

        if (!this.menuItems) {
            return this.menuService.getMenu<MenuDaum[]>(AppConstant.GET_MENUS).pipe(
                map(response => {
                    if (response && response.data) {
                        this.menuItems = response.data;
                        this.localstorage.setSession(AppConstant.GET_MENUS, JSON.stringify(response.data));
                        return this.checkPermission(permission, screenId);
                    }
                    return false;
                }),
                catchError(() => of(false))
            );
        } else {
            return of(this.checkPermission(permission, screenId));
        }
    }

    private checkPermission(permission: string, screenId: number): boolean {
        for (let item of this.menuItems) {
            if (item.class === '') {
                if (item.link === "special_Permission" && screenId === item.screenId) {
                    return item.permissions.some(p => p.type === permission);
                }
            } else {
                for (let subMenu of item.subMenus) {
                    if (subMenu.link === "special_Permission" && screenId === subMenu.screenId) {
                        return subMenu.permissions.some(p => p.type === permission);
                    }
                }
            }
        }
        return false;
    }



}
