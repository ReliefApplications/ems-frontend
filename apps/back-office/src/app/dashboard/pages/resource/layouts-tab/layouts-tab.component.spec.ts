import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { LayoutsTabComponent } from './layouts-tab.component';
import { DialogModule } from '@angular/cdk/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { SkeletonTableModule } from '@oort-front/shared';

describe('LayoutsTabComponent', () => {
  let component: LayoutsTabComponent;
  let fixture: ComponentFixture<LayoutsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutsTabComponent],
      imports: [
        ApolloTestingModule,
        DialogModule,
        SkeletonTableModule,
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
    fixture = TestBed.createComponent(LayoutsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
