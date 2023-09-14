import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabButtonsComponent } from './tab-buttons.component';
import { TranslateModule } from '@ngx-translate/core';
import { AlertModule, ButtonModule } from '@oort-front/ui';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormGroup,
} from '@angular/forms';

describe('TabButtonsComponent', () => {
  let component: TabButtonsComponent;
  let fixture: ComponentFixture<TabButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabButtonsComponent],
      imports: [
        TranslateModule.forRoot(),
        AlertModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabButtonsComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({
      floatingButtons: new UntypedFormArray([]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
