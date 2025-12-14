import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleTagboxComponent } from './people-tagbox.component';

describe('PeopleTagboxComponent', () => {
  let component: PeopleTagboxComponent;
  let fixture: ComponentFixture<PeopleTagboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleTagboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleTagboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
