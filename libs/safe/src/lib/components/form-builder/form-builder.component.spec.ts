import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeFormBuilderComponent } from './form-builder.component';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';

describe('SafeFormBuilderComponent', () => {
  let component: SafeFormBuilderComponent;
  let fixture: ComponentFixture<SafeFormBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: {} },
        { provide: 'environment', useValue: {} },
      ],
      declarations: [SafeFormBuilderComponent],
      imports: [
        DialogCdkModule,
        TranslateModule.forRoot(),
        ApolloTestingModule,
        HttpClientModule,
      ],
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
