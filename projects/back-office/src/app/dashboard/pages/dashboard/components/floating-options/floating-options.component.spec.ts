import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingOptionsComponent } from './floating-options.component';

describe('FloatingOptionsComponent', () => {
  let component: FloatingOptionsComponent;
  let fixture: ComponentFixture<FloatingOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloatingOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatingOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
