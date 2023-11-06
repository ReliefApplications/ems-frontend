import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestServiceDropdownComponent } from './test-service-dropdown.component';

describe('TestServiceDropdownComponent', () => {
  let component: TestServiceDropdownComponent;
  let fixture: ComponentFixture<TestServiceDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestServiceDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestServiceDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
