import {
  Directive,
  Input,
  ComponentRef,
  ElementRef,
  ApplicationRef,
  HostListener,
  ViewContainerRef,
  EmbeddedViewRef
} from '@angular/core';
import { TooltipComponent } from '../../components/tooltip/tooltip.component';

@Directive({
  selector: '[tooltip]',
  standalone: true
})
export class TooltipDirective {

  @Input() tooltip = '';

  private componentRef: ComponentRef<any> | null = null;

  constructor(
    private elementRef: ElementRef,
    private appRef: ApplicationRef,
    private viewContainerRef: ViewContainerRef,
  ) { }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.componentRef === null) {
      const componentFactory =
        this.viewContainerRef.createComponent(
          TooltipComponent);
      this.componentRef = componentFactory;
      const domElem =
        (this.componentRef.hostView as EmbeddedViewRef<any>)
          .rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);
      this.setTooltipComponentProperties();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.destroy();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    if (this.componentRef !== null) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  private setTooltipComponentProperties() {
    if (this.componentRef !== null) {
      this.componentRef.instance.tooltip = this.tooltip;
      const { left, right, bottom } =
        this.elementRef.nativeElement.getBoundingClientRect();
      this.componentRef.instance.left = (right - left) / 2 + left;
      this.componentRef.instance.top = bottom;
    }
  }
}
