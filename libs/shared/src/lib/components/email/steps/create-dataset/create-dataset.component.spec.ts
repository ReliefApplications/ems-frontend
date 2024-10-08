import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateDatasetComponent } from './create-dataset.component';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('CreateDatasetComponent', () => {
  let component: CreateDatasetComponent;
  let fixture: ComponentFixture<CreateDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateDatasetComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
