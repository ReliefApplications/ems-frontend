import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { SafeRecordDropdownComponent } from './record-dropdown.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { SelectMenuModule } from '@oort-front/ui';
import { FormsModule } from '@angular/forms';

describe('SafeRecordDropdownComponent', () => {
  let component: SafeRecordDropdownComponent;
  let fixture: ComponentFixture<SafeRecordDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [TranslateService],
      declarations: [SafeRecordDropdownComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ApolloTestingModule,
        SelectMenuModule,
        FormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeRecordDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
