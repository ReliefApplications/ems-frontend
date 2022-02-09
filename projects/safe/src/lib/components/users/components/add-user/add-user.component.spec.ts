import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeAddUserComponent } from './add-user.component';

describe('SafeAddUserComponent', () => {
  let component: SafeAddUserComponent;
  let fixture: ComponentFixture<SafeAddUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeAddUserComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
