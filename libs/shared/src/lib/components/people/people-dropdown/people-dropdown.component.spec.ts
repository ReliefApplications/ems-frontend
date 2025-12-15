import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleDropdownComponent } from './people-dropdown.component';

describe('PeopleDropdownComponent', () => {
  let component: PeopleDropdownComponent;
  let fixture: ComponentFixture<PeopleDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
