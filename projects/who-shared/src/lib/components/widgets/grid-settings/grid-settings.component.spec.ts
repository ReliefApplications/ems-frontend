import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoGridSettingsComponent } from './grid-settings.component';

describe('WhoGridSettingsComponent', () => {
  let component: WhoGridSettingsComponent;
  let fixture: ComponentFixture<WhoGridSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoGridSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoGridSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
