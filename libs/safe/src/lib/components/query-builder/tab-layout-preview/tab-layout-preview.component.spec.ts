import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { SafeTabLayoutPreviewComponent } from './tab-layout-preview.component';
import { AlertModule } from '@oort-front/ui';
import { SafeCoreGridModule } from '../../ui/core-grid/core-grid.module';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppAbility } from '../../../services/auth/auth.service';

describe('SafeTabLayoutPreviewComponent', () => {
  let component: SafeTabLayoutPreviewComponent;
  let fixture: ComponentFixture<SafeTabLayoutPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        TranslateService,
        { provide: 'environment', useValue: {} },
        AppAbility,
      ],
      declarations: [SafeTabLayoutPreviewComponent],
      imports: [
        TranslateModule.forRoot(),
        AlertModule,
        SafeCoreGridModule,
        ApolloTestingModule,
        HttpClientModule,
        OAuthModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTabLayoutPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
