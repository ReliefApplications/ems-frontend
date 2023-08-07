import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';
import { By } from '@angular/platform-browser';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TooltipComponent, TooltipDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directiveEl = fixture.debugElement.query(
      By.directive(TooltipDirective)
    );
    expect(directiveEl).not.toBeNull();
    expect(component).toBeTruthy();
  });
});
