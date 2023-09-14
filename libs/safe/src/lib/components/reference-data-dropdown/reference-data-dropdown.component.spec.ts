import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeReferenceDataDropdownComponent } from './reference-data-dropdown.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { SelectMenuModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('SafeReferenceDataDropdownComponent', () => {
  let component: SafeReferenceDataDropdownComponent;
  let fixture: ComponentFixture<SafeReferenceDataDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeReferenceDataDropdownComponent],
      imports: [
        ApolloTestingModule,
        TranslateModule.forRoot(),
        HttpClientModule,
        SelectMenuModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeReferenceDataDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
