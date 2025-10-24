import { Component, ElementRef, HostListener, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";
import { MenuService } from "../../../../../domain/services/menu.service";
import { AppConstant } from "../../../../../common/app-constant";
import { LocalStorageService } from "../../../../../common/local-storage.service";
import { MenuDaum } from "../../../../../domain/models/menu.model";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent {
  menuItems: MenuDaum[] = [];
  username: any = "";
  constructor(
    public router: Router,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private localstorage: LocalStorageService,
    private menuService: MenuService
  ) {
    this.getMenu();
  }

  ngOnInit() {
    this.username = this.localstorage.getItem("username");
    this.onResize(null);
  }

  async getMenu() {
    this.menuItems = JSON.parse(this.localstorage.getSessionItem(AppConstant.GET_MENUS));
    if (this.menuItems === null || this.menuItems === undefined) {
      await this.menuService.getMenu<MenuDaum[]>(AppConstant.GET_MENUS).subscribe({
        next: (response) => {
          if (response) {
            this.menuItems = response.data.sort((a, b) => a.order - b.order);
            this.menuItems.forEach(menuItem => {
              if (menuItem.subMenus && menuItem.subMenus.length > 0) {
                menuItem.subMenus.sort((a, b) => a.order - b.order);
              }
            });

            this.localstorage.setSession(AppConstant.GET_MENUS, JSON.stringify(response.data));
          }
        }
      });
    } else {
      this.menuItems = this.menuItems.sort((a, b) => a.order - b.order);
      this.menuItems.forEach(menuItem => {
        if (menuItem.subMenus && menuItem.subMenus.length > 0) {
          menuItem.subMenus.sort((a, b) => a.order - b.order);
        }
      });
    }
  }

  toggleSidebarMenu(event: Event, menuItem: any) {
    const target = event.target as HTMLElement;
    let clickedLiElement = target.closest("li") as HTMLElement;

    if (clickedLiElement) {
      const allLiElements = document.querySelectorAll(".sidebar-main-menu");
      const LiElements = clickedLiElement.querySelector(".sidebar-menu");

      this.renderer.addClass(clickedLiElement, "active");
      if (clickedLiElement.classList.contains("sidebar-main-menu")) {
        allLiElements.forEach((li) => {
          this.renderer.removeClass(li, "active");
          const submenu = li.querySelector(".sidebar-submenus") as HTMLElement;
          if (submenu) {
            this.renderer.removeClass(submenu, "open-sidebarMenu");
          }
        });
      }

      menuItem.isOpen = !menuItem.isOpen;
      if (menuItem.isOpen) {
        this.renderer.addClass(clickedLiElement, "active");
        const submenu = clickedLiElement.querySelector(".sidebar-submenus") as HTMLElement;
        if (submenu) {
          this.renderer.addClass(submenu, "open-sidebarMenu");
        }
      }
      this.renderer.addClass(clickedLiElement, 'active');
    }
  }

  onHover(): void {
    const sideBar = document.querySelector(".side-bar") as HTMLElement;
    sideBar.style.transition = ".3s cubic-bezier(0,0,.2,1)";
    if (sideBar) {
      sideBar.classList.add("enable");
    }
  }
  onMouseLeave(): void {
    const sideBar = document.querySelector(".side-bar") as HTMLElement;

    if (sideBar) {
      sideBar.classList.remove("enable");
    }
  }

  public screenWidth: any;

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    if (this.screenWidth < 991) {
      const clickedInside = this.elementRef.nativeElement.contains(
        event.target
      );
      if (!clickedInside) {
        const sideBar = document.querySelector(".side-bar") as HTMLElement;
        if (sideBar) {
          sideBar.classList.remove("menu-collapsed");
        }
      }
    }
  }
}
