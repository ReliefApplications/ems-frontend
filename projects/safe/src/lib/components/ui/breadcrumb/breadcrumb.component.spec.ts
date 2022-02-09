import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeBreadcrumbComponent } from './breadcrumb.component';

describe('SafeBreadcrumbComponent', () => {
  let component: SafeBreadcrumbComponent;
  let fixture: ComponentFixture<SafeBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeBreadcrumbComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
