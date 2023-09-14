import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabActionsComponent } from './tab-actions.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { IconModule, ToggleModule, TooltipModule } from '@oort-front/ui';

describe('TabActionsComponent', () => {
  let component: TabActionsComponent;
  let fixture: ComponentFixture<TabActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabActionsComponent],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        ToggleModule,
        IconModule,
        TooltipModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabActionsComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({
      actions: new UntypedFormGroup({
        delete: new UntypedFormControl(),
        history: new UntypedFormControl(),
        convert: new UntypedFormControl(),
        update: new UntypedFormControl(),
        inlineEdition: new UntypedFormControl(),
        addRecord: new UntypedFormControl(),
        export: new UntypedFormControl(),
        showDetails: new UntypedFormControl(),
      }),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
