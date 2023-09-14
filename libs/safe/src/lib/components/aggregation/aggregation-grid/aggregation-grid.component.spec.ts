import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeAggregationGridComponent } from './aggregation-grid.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { SafeGridModule } from '../../ui/core-grid/grid/grid.module';

describe('SafeAggregationGridComponent', () => {
  let component: SafeAggregationGridComponent;
  let fixture: ComponentFixture<SafeAggregationGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      declarations: [SafeAggregationGridComponent],
      imports: [
        ApolloTestingModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        SafeGridModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAggregationGridComponent);
    component = fixture.componentInstance;
    component.aggregation = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
