import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormArray } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeAddFieldStageComponent } from './add-field-stage.component';
import { ButtonModule } from '@oort-front/ui';

describe('SafeAddFieldStageComponent', () => {
  let component: SafeAddFieldStageComponent;
  let fixture: ComponentFixture<SafeAddFieldStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeAddFieldStageComponent],
      imports: [TranslateModule.forRoot(), ButtonModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAddFieldStageComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormArray([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
