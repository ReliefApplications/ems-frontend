import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeApplicationTemplatesComponent } from './application-templates.component';

describe('SafeApplicationTemplatesComponent', () => {
  let component: SafeApplicationTemplatesComponent;
  let fixture: ComponentFixture<SafeApplicationTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeApplicationTemplatesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeApplicationTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
