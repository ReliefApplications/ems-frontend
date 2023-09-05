import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipDirective } from './tooltip.directive';

/**
 * Component for testing purposes
 */
@Component({
  template: ` <div [ngClass]="resolvePositionCases">
    <button
      [ngClass]="resolveButtonCases"
      [uiTooltip]="hint"
      class="bg-gray-200 shadow-md hover:shadow-xl hover:bg-gray-300 p-2 rounded-md"
    >
      Random content
    </button>
  </div>`,
})
class TestingComponent {}

describe('TooltipDirective', () => {
  let fixture!: ComponentFixture<TestingComponent>;
  let component: TestingComponent;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TooltipDirective, TestingComponent],
    }).createComponent(TestingComponent);

    fixture.detectChanges(); // initial binding

    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
