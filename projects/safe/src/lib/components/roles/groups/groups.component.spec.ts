import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeGroupsComponent } from './groups.component';

describe('SafeGroupsComponent', () => {
  let component: SafeGroupsComponent;
  let fixture: ComponentFixture<SafeGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeGroupsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
