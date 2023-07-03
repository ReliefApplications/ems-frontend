import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionModalComponent } from './position-modal.component';

describe('PositionModalComponent', () => {
  let component: PositionModalComponent;
  let fixture: ComponentFixture<PositionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PositionModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
