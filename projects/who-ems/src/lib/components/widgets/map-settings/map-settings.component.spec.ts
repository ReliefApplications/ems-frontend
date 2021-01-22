import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoMapSettingsComponent } from './map-settings.component';

describe('WhoMapSettingsComponent', () => {
  let component: WhoMapSettingsComponent;
  let fixture: ComponentFixture<WhoMapSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoMapSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoMapSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
