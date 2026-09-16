import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StorybookTranslateModule } from '../../../../.storybook/storybook-translate.module';
import { DatePipe } from '../../pipes/date/date.pipe';
import { GridField } from '../../models/grid.model';
import { GridDataFormatterService } from './grid-data-formatter.service';

describe('GridDataFormatterService', () => {
  let service: GridDataFormatterService;

  /**
   * Builds a minimal text grid field.
   *
   * @param name field name
   * @returns grid field
   */
  const textField = (name: string): GridField =>
    ({
      name,
      title: name,
      type: 'String',
      format: null,
      editor: 'text',
      filter: {},
      meta: { type: 'text' },
      disabled: false,
      hidden: false,
      width: 100,
      order: 0,
      canSee: true,
    } as unknown as GridField);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StorybookTranslateModule],
      providers: [DatePipe],
    });
    service = TestBed.inject(GridDataFormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should format text fields into the row display text map', () => {
    const row: any = { id: '1', name: 'Alice' };
    service.formatGridRowData(row, [textField('name')]);
    expect(row._display.text).toEqual({ name: 'Alice' });
    expect(row.name).toBe('Alice');
  });

  it('should not overwrite record fields named like a display property', () => {
    const fields = [textField('text'), textField('style'), textField('name')];
    const row: any = { id: '1', text: 'hello', style: 'bold', name: 'Alice' };
    service.formatGridRowData(row, fields);
    expect(row.text).toBe('hello');
    expect(row.style).toBe('bold');
    expect(row._display.text).toEqual({
      text: 'hello',
      style: 'bold',
      name: 'Alice',
    });
  });

  it('should keep the same display values when formatted several times', () => {
    const fields = [textField('text'), textField('name')];
    const row: any = { id: '1', text: 'hello', name: 'Alice' };
    // e.g. records loaded, then sort input change, then language change
    service.formatGridRowData(row, fields);
    service.formatGridRowData(row, fields);
    service.formatGridRowData(row, fields);
    expect(row._display.text).toEqual({ text: 'hello', name: 'Alice' });
  });

  it('should pick up a value updated between two passes', () => {
    const fields = [textField('text')];
    const row: any = { id: '1', text: 'hello' };
    service.formatGridRowData(row, fields);
    // Inline edition / refetch overwrites the record value on the row
    row.text = 'updated';
    service.formatGridRowData(row, fields);
    expect(row._display.text).toEqual({ text: 'updated' });
  });
});
