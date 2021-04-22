import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SafeFloatingOptionsComponent } from './floating-options.component';

describe('SafeFloatingOptionsComponent', () => {
  let component: SafeFloatingOptionsComponent;
  let fixture: ComponentFixture<SafeFloatingOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SafeFloatingOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeFloatingOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
