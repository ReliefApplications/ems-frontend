import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordSelectionTabComponent } from './record-selection-tab.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  DialogModule,
  GraphQLSelectModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

describe('RecordSelectionTabComponent', () => {
  let component: RecordSelectionTabComponent;
  let fixture: ComponentFixture<RecordSelectionTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecordSelectionTabComponent],
      imports: [
        ApolloTestingModule,
        HttpClientModule,
        GraphQLSelectModule,
        FormsModule,
        ReactiveFormsModule,
        SelectMenuModule,
        DialogModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordSelectionTabComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      resource: new UntypedFormControl(),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
