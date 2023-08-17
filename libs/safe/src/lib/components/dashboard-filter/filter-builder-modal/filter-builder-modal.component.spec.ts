import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterBuilderModalComponent } from './filter-builder-modal.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppAbility } from '../../../services/auth/auth.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('FilterBuilderComponent', () => {
  let component: FilterBuilderModalComponent;
  let fixture: ComponentFixture<FilterBuilderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        AppAbility,
        { provide: DialogRef, useValue: { addPanelClass: jest.fn() } },
        { provide: DIALOG_DATA, useValue: {} },
      ],
      imports: [
        FilterBuilderModalComponent,
        ApolloTestingModule,
        HttpClientModule,
        OAuthModule.forRoot(),
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterBuilderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
