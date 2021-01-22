import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDashboardComponent } from './add-dashboard.component';

describe('AddDashboardComponent', () => {
  let component: AddDashboardComponent;
  let fixture: ComponentFixture<AddDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
