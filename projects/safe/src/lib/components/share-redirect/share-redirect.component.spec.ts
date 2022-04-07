import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareRedirectComponent } from './share-redirect.component';

describe('ShareRedirectComponent', () => {
  let component: ShareRedirectComponent;
  let fixture: ComponentFixture<ShareRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShareRedirectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
