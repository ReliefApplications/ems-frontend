import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { TabActionsComponent } from './tab-actions.component';
import { TabActionsModule } from './tab-actions.module';
import { ApplicationService } from '../../../../services/application/application.service';

describe('TabActionsComponent', () => {
  let component: TabActionsComponent;
  let fixture: ComponentFixture<TabActionsComponent>;
  let dialogOpenSpy: jest.Mock;
  let dialogClosedSubject: BehaviorSubject<string[] | undefined>;

  beforeEach(async () => {
    dialogClosedSubject = new BehaviorSubject<string[] | undefined>(undefined);
    dialogOpenSpy = jest
      .fn()
      .mockReturnValue({ closed: dialogClosedSubject.asObservable() });

    await TestBed.configureTestingModule({
      imports: [
        TabActionsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      providers: [
        {
          provide: ApplicationService,
          useValue: {
            application: new BehaviorSubject(null),
            getApplicationPath: () => '',
          },
        },
        { provide: Dialog, useValue: { open: dialogOpenSpy } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TabActionsComponent);
    component = fixture.componentInstance;

    const fb = new UntypedFormBuilder();
    component.formGroup = fb.group({
      actions: fb.group({
        delete: [true],
        history: [true],
        convert: [true],
        update: [true],
        inlineEdition: [true],
        readOnlyFields: [[]],
        addRecord: [false],
        export: [true],
        import: [false],
        showDetails: [true],
        navigateToPage: [false],
        navigateSettings: fb.group({
          pageUrl: [''],
          field: [''],
          title: [''],
        }),
      }),
    });
    component.fields = [{ name: 'email', type: { kind: 'SCALAR' } }];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the read-only fields modal with the current fields and readOnlyFields', async () => {
    component.formGroup
      .get('actions')
      ?.get('readOnlyFields')
      ?.setValue(['name']);

    await component.openReadOnlyFieldsModal();

    expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
    const [, config] = dialogOpenSpy.mock.calls[0];
    expect(config.data.fields).toBe(component.fields);
    expect(config.data.readOnlyFields).toEqual(['name']);
  });

  it('should update the readOnlyFields control when the modal is closed with a value', async () => {
    await component.openReadOnlyFieldsModal();

    dialogClosedSubject.next(['email']);

    expect(
      component.formGroup.get('actions')?.get('readOnlyFields')?.value
    ).toEqual(['email']);
  });

  it('should not touch the readOnlyFields control when the modal is closed without a value', async () => {
    component.formGroup
      .get('actions')
      ?.get('readOnlyFields')
      ?.setValue(['email']);

    await component.openReadOnlyFieldsModal();
    dialogClosedSubject.next(undefined);

    expect(
      component.formGroup.get('actions')?.get('readOnlyFields')?.value
    ).toEqual(['email']);
  });
});
