import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTabComponent } from './add-tab.component';

describe('AddTabComponent', () => {
  let component: AddTabComponent;
  let fixture: ComponentFixture<AddTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
