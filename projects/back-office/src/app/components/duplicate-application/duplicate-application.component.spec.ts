import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateApplicationComponent } from './duplicate-application.component';

describe('DuplicateApplicationComponent', () => {
  let component: DuplicateApplicationComponent;
  let fixture: ComponentFixture<DuplicateApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DuplicateApplicationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
