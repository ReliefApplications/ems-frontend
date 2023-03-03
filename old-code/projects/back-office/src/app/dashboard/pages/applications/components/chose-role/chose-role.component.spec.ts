import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoseRoleComponent } from './chose-role.component';

describe('ChoseRoleComponent', () => {
  let component: ChoseRoleComponent;
  let fixture: ComponentFixture<ChoseRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChoseRoleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoseRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
