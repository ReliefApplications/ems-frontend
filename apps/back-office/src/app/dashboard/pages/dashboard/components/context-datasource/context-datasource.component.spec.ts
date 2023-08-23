import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { ContextDatasourceComponent } from './context-datasource.component';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('ContextDatasourceComponent', () => {
  let component: ContextDatasourceComponent;
  let fixture: ComponentFixture<ContextDatasourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ContextDatasourceComponent,
        ApolloTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        TranslateService,
        {
          provide: DIALOG_DATA,
          useValue: {}
        },
        {
          provide: DialogRef,
          useValue: {
            updateSize: jest.fn(),
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContextDatasourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
