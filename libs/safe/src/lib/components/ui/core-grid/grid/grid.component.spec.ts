import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { SafeGridComponent } from './grid.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { GridModule } from '@progress/kendo-angular-grid';
import { SafeGridToolbarModule } from '../toolbar/toolbar.module';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TooltipModule } from '@oort-front/ui';

describe('SafeGridComponent', () => {
  let component: SafeGridComponent;
  let fixture: ComponentFixture<SafeGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: {} },
        { provide: 'environment', useValue: {} },
      ],
      declarations: [SafeGridComponent],
      imports: [
        SafeGridToolbarModule,
        TooltipModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        GridModule,
        DialogCdkModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        ApolloTestingModule,
        HttpClientModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
