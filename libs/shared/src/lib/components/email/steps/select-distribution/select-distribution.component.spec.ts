import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectDistributionComponent } from './select-distribution.component';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('SelectDistributionComponent', () => {
  let component: SelectDistributionComponent;
  let fixture: ComponentFixture<SelectDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectDistributionComponent],
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
    fixture = TestBed.createComponent(SelectDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
