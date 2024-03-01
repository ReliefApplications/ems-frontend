import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationComponentSelectorComponent } from './automation-component-selector.component';

describe('AutomationComponentSelectorComponent', () => {
  let component: AutomationComponentSelectorComponent;
  let fixture: ComponentFixture<AutomationComponentSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomationComponentSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AutomationComponentSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
