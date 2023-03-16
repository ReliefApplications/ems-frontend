import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SafeFullScreenDirective } from './full-screen.directive';

describe('SafeFullScreenDirective', () => {
  it('should create an instance', () => {
    const renderer = TestBed.inject(Renderer2);
    const el = new ElementRef(new HTMLParagraphElement());
    const directive = new SafeFullScreenDirective(el, renderer, document);
    expect(directive).toBeTruthy();
  });
});
