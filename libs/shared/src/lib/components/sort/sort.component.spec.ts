import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSortComponent } from './sort.component';

describe('SharedSortComponent', () => {
  let component: SharedSortComponent;
  let fixture: ComponentFixture<SharedSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharedSortComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
