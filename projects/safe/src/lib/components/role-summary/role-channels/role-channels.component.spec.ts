import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleChannelsComponent } from './role-channels.component';

describe('RoleChannelsComponent', () => {
  let component: RoleChannelsComponent;
  let fixture: ComponentFixture<RoleChannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleChannelsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
