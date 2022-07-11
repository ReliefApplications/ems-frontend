import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeSelectLayoutComponent } from './select-layout.component';

describe('SafeSelectLayoutComponent', () => {
  let component: SafeSelectLayoutComponent;
  let fixture: ComponentFixture<SafeSelectLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeSelectLayoutComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSelectLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
