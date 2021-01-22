import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FloatingMenuComponent } from './floating-menu.component';

describe('FloatingMenuComponent', () => {
  let component: FloatingMenuComponent;
  let fixture: ComponentFixture<FloatingMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FloatingMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
