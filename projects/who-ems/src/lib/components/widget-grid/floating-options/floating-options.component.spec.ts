import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WhoFloatingOptionsComponent } from './floating-options.component';

describe('WhoFloatingOptionsComponent', () => {
  let component: WhoFloatingOptionsComponent;
  let fixture: ComponentFixture<WhoFloatingOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoFloatingOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoFloatingOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
