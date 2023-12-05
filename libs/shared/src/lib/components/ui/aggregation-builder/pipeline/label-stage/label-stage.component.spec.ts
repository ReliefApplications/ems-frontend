import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelStageComponent } from './label-stage.component';

describe('LabelStageComponent', () => {
  let component: LabelStageComponent;
  let fixture: ComponentFixture<sharedLabelStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabelStageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
