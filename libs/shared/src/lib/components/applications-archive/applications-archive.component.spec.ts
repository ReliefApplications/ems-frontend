import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsArchiveComponent } from './applications-archive.component';

describe('ApplicationsArchiveComponent', () => {
  let component: ApplicationsArchiveComponent;
  let fixture: ComponentFixture<ApplicationsArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationsArchiveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationsArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
