import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';

import { SafeGridRowActionsComponent } from './row-actions.component';

describe('SafeGridRowActionsComponent', () => {
  let component: SafeGridRowActionsComponent;
  let fixture: ComponentFixture<SafeGridRowActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeGridRowActionsComponent],
      imports: [MatMenuModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGridRowActionsComponent);
    component = fixture.componentInstance;
    component.item = {
      canDelete: false,
      canUpdate: false,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
