import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormGroup } from '@angular/forms';

import { SafeGroupStageComponent } from './group-stage.component';

describe('SafeGroupStageComponent', () => {
  let component: SafeGroupStageComponent;
  let fixture: ComponentFixture<SafeGroupStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeGroupStageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGroupStageComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
