import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateApplicationModalComponent } from './duplicate-application-modal.component';

describe('DuplicateApplicationModalComponent', () => {
  let component: DuplicateApplicationModalComponent;
  let fixture: ComponentFixture<DuplicateApplicationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DuplicateApplicationModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateApplicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
