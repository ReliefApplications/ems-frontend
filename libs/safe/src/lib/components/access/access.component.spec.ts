import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeAccessComponent } from './access.component';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { ButtonModule, TooltipModule } from '@oort-front/ui';

describe('SafeAccessComponent', () => {
  let component: SafeAccessComponent;
  let fixture: ComponentFixture<SafeAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [TranslateService],
      declarations: [SafeAccessComponent],
      imports: [
        DialogCdkModule,
        ButtonModule,
        TooltipModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
