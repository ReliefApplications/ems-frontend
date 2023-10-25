import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogRef, DialogModule } from '@angular/cdk/dialog';
import { AddResourceModalComponent } from './add-resource-modal.component';
import {
  TranslateService,
  TranslateLoader,
  TranslateModule,
  TranslateFakeLoader,
} from '@ngx-translate/core';

describe('AddResourceModalComponent', () => {
  let component: AddResourceModalComponent;
  let fixture: ComponentFixture<AddResourceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddResourceModalComponent,
        DialogModule,
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
          provide: DialogRef,
          useValue: {
            updateSize: jest.fn(),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddResourceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
