import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeSummaryCardSettingsComponent } from './summary-card-settings.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { IconModule, TabsModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SafeSummaryCardSettingsComponent', () => {
  let component: SafeSummaryCardSettingsComponent;
  let fixture: ComponentFixture<SafeSummaryCardSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeSummaryCardSettingsComponent],
      imports: [
        BrowserAnimationsModule,
        ApolloTestingModule,
        HttpClientModule,
        TabsModule,
        IconModule,
        TranslateModule.forRoot(),
        TooltipModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSummaryCardSettingsComponent);
    component = fixture.componentInstance;
    component.tile = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
