import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployedVersionModalComponent } from './deployed-version-modal.component';

describe('DeployedVersionModalComponent', () => {
  let component: DeployedVersionModalComponent;
  let fixture: ComponentFixture<DeployedVersionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeployedVersionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeployedVersionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
