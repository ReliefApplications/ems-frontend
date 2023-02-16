import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeMapDownloadComponent } from './map-download.component';

describe('SafeMapDownloadComponent', () => {
  let component: SafeMapDownloadComponent;
  let fixture: ComponentFixture<SafeMapDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeMapDownloadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeMapDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
