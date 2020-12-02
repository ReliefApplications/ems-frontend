import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoPreviousButtonComponent } from './previous-button.component';

describe('WhoPreviousButtonComponent', () => {
  let component: WhoPreviousButtonComponent;
  let fixture: ComponentFixture<WhoPreviousButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoPreviousButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoPreviousButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
