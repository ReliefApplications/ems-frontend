import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralRoleDetailsComponent } from './general-role-details.component';

describe('GeneralRoleDetailsComponent', () => {
  let component: GeneralRoleDetailsComponent;
  let fixture: ComponentFixture<GeneralRoleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralRoleDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralRoleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
