import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SafeAddStepComponent } from './add-step.component';
import { IconModule } from '@oort-front/ui';

describe('SafeAddStepComponent', () => {
  let component: SafeAddStepComponent;
  let fixture: ComponentFixture<SafeAddStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeAddStepComponent],
      imports: [IconModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAddStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
