import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { SafeChartComponent } from './chart.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, SpinnerModule } from '@oort-front/ui';

describe('SafeChartComponent', () => {
  let component: SafeChartComponent;
  let fixture: ComponentFixture<SafeChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [UntypedFormBuilder, { provide: 'environment', useValue: {} }],
      declarations: [SafeChartComponent],
      imports: [
        HttpClientModule,
        ApolloTestingModule,
        HttpClientModule,
        SpinnerModule,
        ButtonModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeChartComponent);
    component = fixture.componentInstance;
    component.settings = {
      title: '',
      chart: {
        type: {
          name: '',
          icon: '',
          class: null,
        },
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
