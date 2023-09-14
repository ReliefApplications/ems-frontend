import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplaySettingsComponent } from './display-settings.component';
import { TranslateModule } from '@ngx-translate/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

describe('DisplaySettingsComponent', () => {
  let component: DisplaySettingsComponent;
  let fixture: ComponentFixture<DisplaySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplaySettingsComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplaySettingsComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({
      widgetDisplay: new UntypedFormGroup({
        showBorder: new UntypedFormControl(),
      }),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
