import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeTagboxComponent } from './tagbox.component';

describe('SafeTagboxComponent', () => {
  let component: SafeTagboxComponent;
  let fixture: ComponentFixture<SafeTagboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeTagboxComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTagboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
