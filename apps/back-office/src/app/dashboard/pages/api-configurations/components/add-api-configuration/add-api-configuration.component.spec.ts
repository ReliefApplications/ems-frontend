import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApiConfigurationComponent } from './add-api-configuration.component';

describe('AddApiConfigurationComponent', () => {
  let component: AddApiConfigurationComponent;
  let fixture: ComponentFixture<AddApiConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddApiConfigurationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddApiConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
