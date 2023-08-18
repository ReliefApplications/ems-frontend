import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewToolbarComponent } from './preview-toolbar.component';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { ButtonModule } from '@oort-front/ui';

describe('PreviewToolbarComponent', () => {
  let component: PreviewToolbarComponent;
  let fixture: ComponentFixture<PreviewToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviewToolbarComponent],
      imports: [
        ButtonModule,
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
    fixture = TestBed.createComponent(PreviewToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
