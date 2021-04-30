import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeProfileComponent } from './profile.component';

describe('SafeProfileComponent', () => {
  let component: SafeProfileComponent;
  let fixture: ComponentFixture<SafeProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
