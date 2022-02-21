import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeAddFieldStageComponent } from './add-field-stage.component';

describe('SafeAddFieldStageComponent', () => {
  let component: SafeAddFieldStageComponent;
  let fixture: ComponentFixture<SafeAddFieldStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeAddFieldStageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAddFieldStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
