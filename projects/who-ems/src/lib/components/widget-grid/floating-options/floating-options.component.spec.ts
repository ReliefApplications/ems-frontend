import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoFloatingOptionsComponent } from './floating-options.component';

describe('WhoFloatingOptionsComponent', () => {
  let component: WhoFloatingOptionsComponent;
  let fixture: ComponentFixture<WhoFloatingOptionsComponent>;

  beforeEach(async(() => {
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
