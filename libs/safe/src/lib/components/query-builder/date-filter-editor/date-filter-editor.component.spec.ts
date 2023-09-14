import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateFilterEditorComponent } from './date-filter-editor.component';
import { ButtonModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('DateFilterEditorComponent', () => {
  let component: DateFilterEditorComponent;
  let fixture: ComponentFixture<DateFilterEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateFilterEditorComponent],
      imports: [
        ButtonModule,
        TranslateModule.forRoot(),
        TooltipModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateFilterEditorComponent);
    component = fixture.componentInstance;
    component.control = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
