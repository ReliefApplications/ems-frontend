import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleResourcesComponent } from './role-resources.component';

describe('RoleResourcesComponent', () => {
  let component: RoleResourcesComponent;
  let fixture: ComponentFixture<RoleResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleResourcesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
