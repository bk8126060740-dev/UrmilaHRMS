import { Component, ViewChild } from "@angular/core";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: "app-basic-layout",
  templateUrl: "./basic-layout.component.html",
  styleUrl: "./basic-layout.component.scss",
})
export class BasicLayoutComponent {
  constructor() { }

  async ngOnInit() { }
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;

  callHeaderMethodFromProject() {
    if (this.headerComponent) {
      this.headerComponent.getProjectDropdownData();
    }
  }
}
