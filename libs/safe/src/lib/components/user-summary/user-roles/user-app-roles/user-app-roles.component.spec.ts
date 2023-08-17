import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAppRolesComponent } from './user-app-roles.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { GraphQLSelectModule, SelectMenuModule } from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('UserAppRolesComponent', () => {
  let component: UserAppRolesComponent;
  let fixture: ComponentFixture<UserAppRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAppRolesComponent],
      imports: [
        GraphQLSelectModule,
        SelectMenuModule,
        ApolloTestingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAppRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
