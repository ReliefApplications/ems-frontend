import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { MenuModule } from '@oort-front/ui';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { WidgetActionsComponent } from './widget-actions.component';

describe('WidgetActionsComponent', () => {
  let component: WidgetActionsComponent;
  let fixture: ComponentFixture<WidgetActionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [TranslateService],
      declarations: [WidgetActionsComponent],
      imports: [
        DialogCdkModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        MenuModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
