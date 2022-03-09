import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeEditUserComponent } from './edit-user.component';

describe('SafeEditUserComponent', () => {
  let component: SafeEditUserComponent;
  let fixture: ComponentFixture<SafeEditUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeEditUserComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
