import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { EditTemplateModalComponent } from './edit-template-modal.component';
import { TranslateModule } from '@ngx-translate/core';

describe('EditTemplateModalComponent', () => {
  let component: EditTemplateModalComponent;
  let fixture: ComponentFixture<EditTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: { updateSize: jest.fn() } },
        { provide: DIALOG_DATA, useValue: { template: { roles: [] } } },
        { provide: 'environment', useValue: { frontOfficeUri: 'http://.' } },
      ],
      imports: [
        DialogCdkModule,
        TranslateModule.forRoot(),
        EditTemplateModalComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
