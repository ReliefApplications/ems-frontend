import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeSortStageComponent } from './sort-stage.component';
import { TranslateModule } from '@ngx-translate/core';
import { SelectMenuModule } from '@oort-front/ui';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

describe('SafeSortStageComponent', () => {
  let component: SafeSortStageComponent;
  let fixture: ComponentFixture<SafeSortStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeSortStageComponent],
      imports: [
        TranslateModule.forRoot(),
        SelectMenuModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSortStageComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      field: new UntypedFormControl(),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
