import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeGroupListComponent } from './group-list.component';

describe('SafeGroupListComponent', () => {
  let component: SafeGroupListComponent;
  let fixture: ComponentFixture<SafeGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeGroupListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
