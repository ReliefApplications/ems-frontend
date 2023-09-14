import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryCardGeneralComponent } from './summary-card-general.component';
import { DialogModule } from '@oort-front/ui';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

describe('SummaryCardGeneralComponent', () => {
  let component: SummaryCardGeneralComponent;
  let fixture: ComponentFixture<SummaryCardGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SummaryCardGeneralComponent,
        DialogModule,
        ApolloTestingModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryCardGeneralComponent);
    component = fixture.componentInstance;
    component.tileForm = new UntypedFormGroup({
      title: new UntypedFormControl(),
      card: new UntypedFormGroup({ resource: new UntypedFormControl() }),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
