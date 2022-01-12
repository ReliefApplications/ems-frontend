import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeLayoutComponent } from './layout.component';

describe('SafeLayoutComponent', () => {
  let component: SafeLayoutComponent;
  let fixture: ComponentFixture<SafeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeLayoutComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
