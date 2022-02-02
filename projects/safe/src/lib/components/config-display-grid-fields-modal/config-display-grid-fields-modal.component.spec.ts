import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigDisplayGridFieldsModalComponent } from './config-display-grid-fields-modal.component';

describe('ConfigDisplayGridFieldsModalComponent', () => {
  let component: ConfigDisplayGridFieldsModalComponent;
  let fixture: ComponentFixture<ConfigDisplayGridFieldsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigDisplayGridFieldsModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigDisplayGridFieldsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
