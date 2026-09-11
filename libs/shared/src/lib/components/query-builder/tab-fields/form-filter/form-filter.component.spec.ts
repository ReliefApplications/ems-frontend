import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { FormFilterComponent } from './form-filter.component';

describe('FormFilterComponent', () => {
  let component: FormFilterComponent;
  let fixture: ComponentFixture<FormFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormFilterComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits the selected form id', () => {
    const emitted: string[] = [];
    component.selectedFormIdChange.subscribe((value) => emitted.push(value));

    component.onSelectionChange('form-id');

    expect(component.selectedFormId).toBe('form-id');
    expect(emitted).toEqual(['form-id']);
  });

  it('resets the selection when the selected form disappears', () => {
    const emitted: string[] = [];
    component.selectedFormIdChange.subscribe((value) => emitted.push(value));
    component.selectedFormId = 'form-id';
    component.forms = [{ id: 'other', name: 'Other', fields: [] }];

    component.ngOnChanges({
      forms: { currentValue: component.forms } as any,
    });

    expect(component.selectedFormId).toBe('');
    expect(emitted).toEqual(['']);
  });
});
