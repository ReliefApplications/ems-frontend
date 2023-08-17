import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import {
  ButtonModule,
  DividerModule,
  IconModule,
  MenuModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeFloatingOptionsComponent } from './floating-options.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';

describe('SafeFloatingOptionsComponent', () => {
  let component: SafeFloatingOptionsComponent;
  let fixture: ComponentFixture<SafeFloatingOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      declarations: [SafeFloatingOptionsComponent],
      imports: [
        DialogCdkModule,
        TranslateModule.forRoot(),
        MenuModule,
        ApolloTestingModule,
        HttpClientModule,
        IconModule,
        DividerModule,
        ButtonModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeFloatingOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
