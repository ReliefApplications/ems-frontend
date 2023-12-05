import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuModule } from '@oort-front/ui';

import { GridRowActionsComponent } from './row-actions.component';

describe('GridRowActionsComponent', () => {
  let component: GridRowActionsComponent;
  let fixture: ComponentFixture<GridRowActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GridRowActionsComponent],
      imports: [MenuModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridRowActionsComponent);
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
