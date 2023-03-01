import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeIconComponent } from './icon.component';

describe('SafeIconComponent', () => {
  let component: SafeIconComponent;
  let fixture: ComponentFixture<SafeIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeIconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
