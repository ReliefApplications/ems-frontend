import { Component, Renderer2, Type } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SafeDrawerPositionerDirective } from './drawer-positioner.directive';

/**
 * Host component to use the directive on,
 * All inputs will be necessary but elementHeight is the only ones that gives an error on creation
 */
@Component({
  template: `<div safeDrawerPositioner elementHeight="200px"></div>`,
})
class TestComponent {}

describe('FullscreenDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let renderer2: Renderer2;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SafeDrawerPositionerDirective, TestComponent],
      providers: [Renderer2],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);

    // Mock all renderer functions
    renderer2 = fixture.componentRef.injector.get<Renderer2>(
      Renderer2 as Type<Renderer2>
    );
    jest.spyOn(renderer2, 'addClass').mockReset();
    jest.spyOn(renderer2, 'setStyle').mockReset();
    jest.spyOn(renderer2, 'removeStyle').mockReset();

    fixture.detectChanges(); // initial binding

    component = fixture.componentInstance;
  });
  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
