import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserBackRolesComponent } from './user-back-roles.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { SelectMenuModule } from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('UserBackRolesComponent', () => {
  let component: UserBackRolesComponent;
  let fixture: ComponentFixture<UserBackRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserBackRolesComponent],
      imports: [
        ApolloTestingModule,
        HttpClientModule,
        SelectMenuModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBackRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
