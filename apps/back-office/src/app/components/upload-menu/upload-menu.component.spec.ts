import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadMenuComponent } from './upload-menu.component';
import { UploadModule } from '@progress/kendo-angular-upload';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  TranslateService,
  TranslateLoader,
  TranslateModule,
  TranslateFakeLoader,
} from '@ngx-translate/core';
import { ButtonModule } from '@oort-front/ui';

describe('UploadMenuComponent', () => {
  let component: UploadMenuComponent;
  let fixture: ComponentFixture<UploadMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadMenuComponent],
      imports: [
        UploadModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ButtonModule,
      ],
      providers: [TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
