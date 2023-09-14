import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDistributionListModalComponent } from './edit-distribution-list-modal.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('EditDistributionListModalComponent', () => {
  let component: EditDistributionListModalComponent;
  let fixture: ComponentFixture<EditDistributionListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: { updateSize: jest.fn() } },
        { provide: DIALOG_DATA, useValue: {} },
      ],
      imports: [EditDistributionListModalComponent, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDistributionListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
