import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSchedulerSettingsComponent } from './scheduler-settings.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { RadioModule, SelectMenuModule } from '@oort-front/ui';

describe('SafeSchedulerSettingsComponent', () => {
  let component: SafeSchedulerSettingsComponent;
  let fixture: ComponentFixture<SafeSchedulerSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SafeSchedulerSettingsComponent],
      imports: [
        TranslateModule.forRoot(),
        ApolloTestingModule,
        HttpClientModule,
        RadioModule,
        SelectMenuModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSchedulerSettingsComponent);
    component = fixture.componentInstance;
    component.tile = {
      if: '',
      settings: {
        source: '',
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
