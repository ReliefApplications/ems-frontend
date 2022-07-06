import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleWorkflowsComponent } from './role-workflows.component';

describe('RoleWorkflowsComponent', () => {
  let component: RoleWorkflowsComponent;
  let fixture: ComponentFixture<RoleWorkflowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleWorkflowsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleWorkflowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
