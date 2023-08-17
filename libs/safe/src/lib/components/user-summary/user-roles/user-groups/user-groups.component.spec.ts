import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserGroupsComponent } from './user-groups.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { SelectMenuModule } from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('UserGroupsComponent', () => {
  let component: UserGroupsComponent;
  let fixture: ComponentFixture<UserGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserGroupsComponent],
      imports: [
        ApolloTestingModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        SelectMenuModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
