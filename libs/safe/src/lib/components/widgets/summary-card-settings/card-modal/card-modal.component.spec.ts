import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeCardModalComponent } from './card-modal.component';

describe('SafeCardModalComponent', () => {
  let component: SafeCardModalComponent;
  let fixture: ComponentFixture<SafeCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeCardModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
