/* tslint:disable:no-unused-variable */
import { CaptionDirective } from './caption.directive';
import { ElementRef, Renderer2 } from '@angular/core';

const mockElementRef = {
  nativeElement: document.createElement('div')
};

const mockRenderer2 = {
  setElementAttribute: () => {}
};

describe('Directive: Caption', () => {
  it('should create an instance', () => {
    const directive = new CaptionDirective(mockElementRef as ElementRef, mockRenderer2 as unknown as Renderer2);
    expect(directive).toBeTruthy();
  });
});
