import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeAccessComponent } from './access.component';

describe('SafeAccessComponent', () => {
  let component: SafeAccessComponent;
  let fixture: ComponentFixture<SafeAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeAccessComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
