import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeRoleListComponent } from './role-list.component';
import { DialogModule } from '@angular/cdk/dialog';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppAbility } from '../../../../../lib/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SafeSkeletonTableModule } from '../../../skeleton/skeleton-table/skeleton-table.module';

describe('SafeRoleListComponent', () => {
  let component: SafeRoleListComponent;
  let fixture: ComponentFixture<SafeRoleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        AppAbility,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
      ],
      declarations: [SafeRoleListComponent],
      imports: [
        DialogModule,
        ApolloTestingModule,
        SafeSkeletonTableModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        OAuthModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeRoleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
