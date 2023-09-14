import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { SafeGroupStageComponent } from './group-stage.component';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, SelectMenuModule } from '@oort-front/ui';
import { SafeAddFieldStageComponent } from '../add-field-stage/add-field-stage.component';
import { SafeFieldDropdownComponent } from '../field-dropdown/field-dropdown.component';

describe('SafeGroupStageComponent', () => {
  let component: SafeGroupStageComponent;
  let fixture: ComponentFixture<SafeGroupStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SafeGroupStageComponent,
        SafeAddFieldStageComponent,
        SafeFieldDropdownComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        ButtonModule,
        SelectMenuModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGroupStageComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      groupBy: new UntypedFormArray([
        new UntypedFormGroup({
          operator: new UntypedFormControl(),
          field: new UntypedFormControl(),
        }),
      ]),
      addFields: new UntypedFormArray([]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
