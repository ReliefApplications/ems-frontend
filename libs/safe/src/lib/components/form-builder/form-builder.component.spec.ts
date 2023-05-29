import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from 'projects/back-office/src/environments/environment';
import { SafeFormBuilderComponent } from './form-builder.component';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';

describe('SafeFormBuilderComponent', () => {
  let component: SafeFormBuilderComponent;
  let fixture: ComponentFixture<SafeFormBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: {} },
        { provide: 'environment', useValue: environment },
      ],
      declarations: [SafeFormBuilderComponent],
      imports: [DialogCdkModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeFormBuilderComponent);
    component = fixture.componentInstance;
    component.form = {
      structure: 'Dummy Form',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
