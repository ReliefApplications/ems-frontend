import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { environment } from 'projects/back-office/src/environments/environment';

import { SafeChartComponent } from './chart.component';

describe('SafeChartComponent', () => {
  let component: SafeChartComponent;
  let fixture: ComponentFixture<SafeChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        { provide: 'environment', useValue: environment },
      ],
      declarations: [SafeChartComponent],
      imports: [HttpClientModule],
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
