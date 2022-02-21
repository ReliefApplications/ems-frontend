import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeQueryStyleComponent } from './query-style.component';

describe('SafeQueryStyleComponent', () => {
  let component: SafeQueryStyleComponent;
  let fixture: ComponentFixture<SafeQueryStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeQueryStyleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeQueryStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
