import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousButtonComponent } from './previous-button.component';

describe('PreviousButtonComponent', () => {
  let component: PreviousButtonComponent;
  let fixture: ComponentFixture<PreviousButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviousButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
