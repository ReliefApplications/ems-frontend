import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailsComponent } from './user-details.component';
import { HttpClientModule } from '@angular/common/http';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AppAbility } from '../../../services/auth/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { AbilityModule } from '@casl/angular';
import { PureAbility } from '@casl/ability';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        AppAbility,
        PureAbility,
      ],
      declarations: [UserDetailsComponent],
      imports: [
        HttpClientModule,
        ApolloTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        AbilityModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    component.user = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
