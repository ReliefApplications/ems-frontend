import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeTabFieldsComponent } from './tab-fields.component';

describe('SafeTabFieldsComponent', () => {
  let component: SafeTabFieldsComponent;
  let fixture: ComponentFixture<SafeTabFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeTabFieldsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTabFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
