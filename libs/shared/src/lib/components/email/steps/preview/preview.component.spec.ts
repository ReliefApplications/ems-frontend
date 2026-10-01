import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { RestService } from '../../../../services/rest/rest.service';
import { EmailService } from '../../email.service';
import { PreviewComponent } from './preview.component';

describe('PreviewComponent', () => {
  let fixture: ComponentFixture<PreviewComponent>;
  let component: PreviewComponent;
  let emailServiceMock: any;

  /**
   * Seeds the datasets of the notification form.
   *
   * @param datasets Dataset values
   */
  const seedDatasets = (datasets: any[]) => {
    emailServiceMock.datasetsForm = new FormGroup({
      datasets: new FormArray(
        datasets.map((dataset) => new FormControl(dataset))
      ),
    });
  };

  beforeEach(async () => {
    emailServiceMock = {
      isGridAction: false,
      allLayoutdata: {},
      datasetsForm: new FormGroup({ datasets: new FormArray([]) }),
      // Called on destroy
      patchTableStyles: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PreviewComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        { provide: Apollo, useValue: {} },
        { provide: EmailService, useValue: emailServiceMock },
        { provide: RestService, useValue: { apiUrl: '' } },
      ],
    })
      // Logic-only tests: the template renders the whole email preview
      .overrideTemplate(PreviewComponent, '')
      .compileComponents();

    // ngOnInit loads the preview from the API, which these tests do not exercise
    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('blockGoesToDistributionList', () => {
    describe('email notification', () => {
      it('reads the toggle of the matching send-separate dataset', () => {
        seedDatasets([
          { name: 'Block 1', individualEmailToDistributionList: true },
          { name: 'Block 2', individualEmailToDistributionList: false },
          { name: 'Block 3' },
        ]);

        expect(component.blockGoesToDistributionList('Block 1')).toBe(true);
        expect(component.blockGoesToDistributionList('Block 2')).toBe(false);
        expect(component.blockGoesToDistributionList('Block 3')).toBe(false);
      });

      it('is false for an unknown block', () => {
        seedDatasets([
          { name: 'Block 1', individualEmailToDistributionList: true },
        ]);

        expect(component.blockGoesToDistributionList('Other')).toBe(false);
      });

      it('tolerates a missing form', () => {
        emailServiceMock.datasetsForm = undefined;

        expect(component.blockGoesToDistributionList('Block 1')).toBe(false);
      });
    });

    describe('grid action', () => {
      beforeEach(() => {
        emailServiceMock.isGridAction = true;
        seedDatasets([
          { name: 'Block 1', individualEmailToDistributionList: false },
        ]);
      });

      it('is true as soon as the distribution list has a recipient', () => {
        component.distributionListTo = ['to@example.com'];
        expect(component.blockGoesToDistributionList('Block 1')).toBe(true);

        component.distributionListTo = [];
        component.distributionListCc = ['cc@example.com'];
        expect(component.blockGoesToDistributionList('Block 1')).toBe(true);

        component.distributionListCc = [];
        component.distributionListBcc = ['bcc@example.com'];
        expect(component.blockGoesToDistributionList('Block 1')).toBe(true);
      });

      it('is false when the distribution list is empty', () => {
        component.distributionListTo = [];
        component.distributionListCc = [];
        component.distributionListBcc = [];

        expect(component.blockGoesToDistributionList('Block 1')).toBe(false);
      });
    });
  });
});
