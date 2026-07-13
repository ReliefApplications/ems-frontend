import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ChoseRoleComponent } from './chose-role.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { DialogModule, ButtonModule, SpinnerModule } from '@oort-front/ui';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('ChoseRoleComponent', () => {
  let component: ChoseRoleComponent;
  let fixture: ComponentFixture<ChoseRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChoseRoleComponent],
      providers: [
        TranslateService,
        {
          provide: DialogRef,
          useValue: {
            updateSize: jest.fn(),
          },
        },
        {
          provide: DIALOG_DATA,
          useValue: {},
        },
      ],
      imports: [
        DialogModule,
        ApolloTestingModule,
        ButtonModule,
        SpinnerModule,
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
    fixture = TestBed.createComponent(ChoseRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
