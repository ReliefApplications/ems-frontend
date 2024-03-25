import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAutomationComponentComponent } from './edit-automation-component.component';

describe('EditAutomationComponentComponent', () => {
  let component: EditAutomationComponentComponent;
  let fixture: ComponentFixture<EditAutomationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAutomationComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAutomationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
