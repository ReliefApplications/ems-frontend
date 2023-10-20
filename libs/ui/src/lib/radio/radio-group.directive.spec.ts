import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioGroupDirective } from './radio-group.directive';
import { RadioComponent } from './radio.component';

/**
 * Component for testing purposes
 */
@Component({
  template: ` <div
      class="space-y-4"
      (groupValueChange)="getRadioChangeSelection($event)"
      [uiRadioGroupDirective]="args.name"
    >
      <ui-radio
        *ngFor="let option of radioOptions; let i = index"
        [checked]="i === 0"
        [disabled]="args.disabled"
        [variant]="args.variant"
        [value]="option.value"
      >
        <ng-container ngProjectAs="label">{{ option.label }}</ng-container>
      </ui-radio>
    </div>
    <br />
    <p>value: {{ selectedOption }}</p>`,
})
class TestingComponent {
  public args: RadioComponent = new RadioComponent();

  /**
   * Init args name
   */
  constructor() {
    this.args.name = 'notification-method';
  }
}

describe('RadioGroupDirective', () => {
  let fixture!: ComponentFixture<TestingComponent>;
  let component: TestingComponent;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [RadioGroupDirective, TestingComponent],
    }).createComponent(TestingComponent);

    fixture.detectChanges(); // initial binding

    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
