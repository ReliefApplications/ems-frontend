import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapGeneralComponent } from './map-general.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { GraphQLSelectModule } from '@oort-front/ui';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

describe('MapGeneralComponent', () => {
  let component: MapGeneralComponent;
  let fixture: ComponentFixture<MapGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapGeneralComponent],
      imports: [
        ApolloTestingModule,
        HttpClientModule,
        GraphQLSelectModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapGeneralComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      title: new UntypedFormControl(),
      resource: new UntypedFormControl(),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
