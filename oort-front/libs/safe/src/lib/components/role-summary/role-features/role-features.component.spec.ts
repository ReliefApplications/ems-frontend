import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleFeaturesComponent } from './role-features.component';

describe('RoleFeaturesComponent', () => {
  let component: RoleFeaturesComponent;
  let fixture: ComponentFixture<RoleFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleFeaturesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
