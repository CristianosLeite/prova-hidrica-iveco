import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptionDirective } from './caption.directive';

@NgModule({
  declarations: [CaptionDirective],
  imports: [CommonModule],
  exports: [CaptionDirective]
})
export class CaptionModule { }
