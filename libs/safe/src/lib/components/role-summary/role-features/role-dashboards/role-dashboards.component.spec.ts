import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleDashboardsComponent } from './role-dashboards.component';

describe('RoleDashboardsComponent', () => {
  let component: RoleDashboardsComponent;
  let fixture: ComponentFixture<RoleDashboardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleDashboardsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleDashboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
