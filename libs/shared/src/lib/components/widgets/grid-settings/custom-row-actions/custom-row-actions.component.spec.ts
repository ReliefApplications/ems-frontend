import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRowActionsComponent } from './custom-row-actions.component';

describe('CustomRowActionsComponent', () => {
  let component: CustomRowActionsComponent;
  let fixture: ComponentFixture<CustomRowActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomRowActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomRowActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
