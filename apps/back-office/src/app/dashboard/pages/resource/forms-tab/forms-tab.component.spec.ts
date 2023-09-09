import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { FormsTabComponent } from './forms-tab.component';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { DialogModule } from '@angular/cdk/dialog';
import { SafeSkeletonTableModule } from '@oort-front/safe';

describe('FormsTabComponent', () => {
  let component: FormsTabComponent;
  let fixture: ComponentFixture<FormsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsTabComponent],
      imports: [
        ApolloTestingModule,
        DialogModule,
        SafeSkeletonTableModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [TranslateService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
