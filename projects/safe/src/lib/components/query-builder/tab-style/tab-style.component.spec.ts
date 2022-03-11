import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeTabStyleComponent } from './tab-style.component';

describe('SafeTabStyleComponent', () => {
  let component: SafeTabStyleComponent;
  let fixture: ComponentFixture<SafeTabStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeTabStyleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTabStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
