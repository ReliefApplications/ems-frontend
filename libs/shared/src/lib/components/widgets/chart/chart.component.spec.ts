import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';

import { ChartComponent } from './chart.component';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [UntypedFormBuilder, { provide: 'environment', useValue: {} }],
      declarations: [ChartComponent],
      imports: [HttpClientModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
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
