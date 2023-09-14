import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleChannelsComponent } from './role-channels.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, SelectMenuModule } from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('RoleChannelsComponent', () => {
  let component: RoleChannelsComponent;
  let fixture: ComponentFixture<RoleChannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleChannelsComponent],
      imports: [
        ApolloTestingModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        SelectMenuModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
