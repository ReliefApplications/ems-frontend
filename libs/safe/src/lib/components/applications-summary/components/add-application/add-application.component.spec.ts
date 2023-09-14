import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeAddApplicationComponent } from './add-application.component';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '@oort-front/ui';

describe('SafeAddApplicationComponent', () => {
  let component: SafeAddApplicationComponent;
  let fixture: ComponentFixture<SafeAddApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeAddApplicationComponent],
      imports: [TranslateModule.forRoot(), IconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAddApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
