import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedWrapperComponent } from './fixed-wrapper.component';

describe('FixedWrapperComponent', () => {
  let component: FixedWrapperComponent;
  let fixture: ComponentFixture<FixedWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixedWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FixedWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
