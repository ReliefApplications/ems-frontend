import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeAvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  let component: SafeAvatarComponent;
  let fixture: ComponentFixture<SafeAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeAvatarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
