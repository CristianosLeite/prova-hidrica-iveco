import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCaption]',
  standalone: false,
})
export class CaptionDirective implements OnInit {
  @Input('appCaption') item: string = '';
  @Input() showText: boolean = true;
  private static generatedColors: { [key: string]: string } = {};

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    if (!CaptionDirective.generatedColors[this.item]) {
      CaptionDirective.generatedColors[this.item] = this.generateLightColor();
    }
    const color = CaptionDirective.generatedColors[this.item];

    // Create a circle with the color
    const circle = this.renderer.createElement('span');
    this.renderer.setStyle(circle, 'display', 'inline-block');
    this.renderer.setStyle(circle, 'width', '10px');
    this.renderer.setStyle(circle, 'height', '10px');
    this.renderer.setStyle(circle, 'border-radius', '50%');
    this.renderer.setStyle(circle, 'background-color', color);
    this.renderer.setStyle(circle, 'margin-right', '5px');

    // Add the circle before the text
    const parent = this.el.nativeElement;
    this.renderer.insertBefore(parent, circle, parent.firstChild);

    // Remove the text if showText is false
    if (!this.showText) {
      this.renderer.removeChild(parent, parent.lastChild);
    }
  }

  private generateLightColor(): string {
    const r = Math.floor(100 + Math.random() * 156);
    const g = Math.floor(100 + Math.random() * 156);
    const b = Math.floor(100 + Math.random() * 156);
    return `rgb(${r}, ${g}, ${b})`;
  }
}
