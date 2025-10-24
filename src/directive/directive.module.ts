import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDirective } from './dragDrop.directive';
import { AllowOnlyCharsDirective } from './allowOnlyChars.directive';
import { MaxNumberDirective } from './maxNumber.directive';
import { RestrictInputDirective } from './restrictInput.directive';
import { EmailInputDirective } from './emailInput.directive';



@NgModule({
  declarations: [
    DragDirective,
    AllowOnlyCharsDirective,
    MaxNumberDirective,
    RestrictInputDirective,
    EmailInputDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DragDirective,
    AllowOnlyCharsDirective,
    MaxNumberDirective,
    RestrictInputDirective,
    EmailInputDirective
  ]
})
export class DirectiveModule { }
