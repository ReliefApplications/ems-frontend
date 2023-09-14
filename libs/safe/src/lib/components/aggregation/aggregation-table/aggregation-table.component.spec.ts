import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { AggregationTableComponent } from './aggregation-table.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from '@oort-front/ui';

describe('AggregationTableComponent', () => {
  let component: AggregationTableComponent;
  let fixture: ComponentFixture<AggregationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AggregationTableComponent],
      imports: [
        DialogCdkModule,
        TranslateModule.forRoot(),
        ApolloTestingModule,
        HttpClientModule,
        ButtonModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
