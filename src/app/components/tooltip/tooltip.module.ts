import { NgModule } from '@angular/core';
import { TooltipDirective } from './../../directives/tooltip/tooltip.directive';
import { TooltipComponent } from './tooltip.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    TooltipDirective,
    TooltipComponent,
    CommonModule
  ],
  exports: [TooltipDirective]
})
export class TooltipModule { }
