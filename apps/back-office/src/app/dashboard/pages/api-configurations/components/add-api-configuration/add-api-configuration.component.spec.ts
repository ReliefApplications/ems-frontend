import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApiConfigurationComponent } from './add-api-configuration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';

describe('AddApiConfigurationComponent', () => {
  let component: AddApiConfigurationComponent;
  let fixture: ComponentFixture<AddApiConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddApiConfigurationComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [DialogRef],
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
