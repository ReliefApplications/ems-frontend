import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeSummaryCardComponent } from './summary-card.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule, DialogModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { SafeSkeletonModule } from '../../../directives/skeleton/skeleton.module';

describe('SafeSummaryCardComponent', () => {
  let component: SafeSummaryCardComponent;
  let fixture: ComponentFixture<SafeSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeSummaryCardComponent],
      imports: [
        ApolloTestingModule,
        HttpClientModule,
        DialogModule,
        TranslateModule.forRoot(),
        ButtonModule,
        PDFExportModule,
        TooltipModule,
        SafeSkeletonModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSummaryCardComponent);
    component = fixture.componentInstance;
    component.settings = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
