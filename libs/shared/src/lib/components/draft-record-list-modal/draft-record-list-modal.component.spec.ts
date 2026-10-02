import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { print } from 'graphql';
import { of, Subject, throwError } from 'rxjs';
import { Record as RecordModel } from '../../models/record.model';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { FormHelpersService } from '../../services/form-helper/form-helper.service';
import { DraftRecordListModalComponent } from './draft-record-list-modal.component';
import { GET_DRAFT_RECORD, GET_DRAFT_RECORDS } from './graphql/queries';

describe('DraftRecordListModalComponent', () => {
  const form = { id: 'form-id', structure: '{}' };
  const dialog = { open: jest.fn() } as unknown as Dialog;
  const dialogRef = {
    close: jest.fn(),
  } as unknown as DialogRef<RecordModel | undefined>;
  const confirmService = {
    openConfirmModal: jest.fn(() => ({ closed: of(true) })),
  } as unknown as ConfirmService;
  const formHelpersService = {
    deleteRecordDraft: jest.fn(),
  } as unknown as FormHelpersService;
  const snackBar = {
    openSnackBar: jest.fn(),
  } as unknown as SnackbarService;
  const translate = {
    instant: (key: string) => key,
  } as unknown as TranslateService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('requests only paginated draft summary fields', () => {
    const query = print(GET_DRAFT_RECORDS);

    expect(query).toContain('draftRecords');
    expect(query).toContain('createdAt');
    expect(query).toContain('modifiedAt');
    expect(query).not.toContain('data');
    expect(query).not.toContain('structure');
  });

  it('sends paging and sorting to the backend and maps connection nodes', () => {
    const apollo = {
      query: jest.fn().mockReturnValue(
        of({
          data: {
            draftRecords: {
              edges: [
                {
                  node: {
                    id: 'draft-id',
                    createdAt: '2026-10-01T10:00:00Z',
                    modifiedAt: '2026-10-01T11:00:00Z',
                  },
                },
              ],
              totalCount: 12,
            },
          },
        })
      ),
    } as unknown as Apollo;
    const component = createComponent(apollo);

    component.ngOnInit();

    expect(apollo.query).toHaveBeenCalledWith(
      expect.objectContaining({
        query: GET_DRAFT_RECORDS,
        variables: {
          form: 'form-id',
          first: 10,
          skip: 0,
          sortField: 'modifiedAt',
          sortOrder: 'desc',
        },
      })
    );
    expect(component.dataset.total).toBe(12);
    expect(component.dataset.data[0].id).toBe('draft-id');
  });

  it('ignores a stale list response after the page changes', () => {
    const firstResponse = new Subject<unknown>();
    const secondResponse = new Subject<unknown>();
    const apollo = {
      query: jest
        .fn()
        .mockReturnValueOnce(firstResponse)
        .mockReturnValueOnce(secondResponse),
    } as unknown as Apollo;
    const component = createComponent(apollo);
    component.ngOnInit();
    component.onPage({ skip: 10, take: 10 });

    secondResponse.next({
      data: { draftRecords: { edges: [], totalCount: 10 } },
    });
    firstResponse.next({
      data: {
        draftRecords: {
          edges: [
            {
              node: {
                id: 'stale-id',
                createdAt: '2026-10-01T10:00:00Z',
                modifiedAt: '2026-10-01T11:00:00Z',
              },
            },
          ],
          totalCount: 11,
        },
      },
    });

    expect(component.dataset).toEqual({ data: [], total: 10 });
    expect(component.loading).toBe(false);
  });

  it('loads full draft data only after load confirmation', async () => {
    const record = { id: 'draft-id', data: { title: 'Draft' } };
    const apollo = {
      query: jest.fn().mockImplementation(({ query }: { query: unknown }) => {
        if (query === GET_DRAFT_RECORD) {
          return of({ data: { record } });
        }
        return of({
          data: { draftRecords: { edges: [], totalCount: 0 } },
        });
      }),
    } as unknown as Apollo;
    const component = createComponent(apollo);

    await component.onClose({
      id: 'draft-id',
      createdAt: '2026-10-01T10:00:00Z',
      modifiedAt: '2026-10-01T11:00:00Z',
    });

    expect(apollo.query).toHaveBeenCalledWith(
      expect.objectContaining({
        query: GET_DRAFT_RECORD,
        variables: { id: 'draft-id' },
      })
    );
    expect(dialogRef.close).toHaveBeenCalledWith(record);
  });

  it('keeps the picker open and reports lazy-load failures', async () => {
    const apollo = {
      query: jest
        .fn()
        .mockReturnValue(throwError(() => new Error('network failed'))),
    } as unknown as Apollo;
    const component = createComponent(apollo);

    await component.onClose({
      id: 'draft-id',
      createdAt: '2026-10-01T10:00:00Z',
      modifiedAt: '2026-10-01T11:00:00Z',
    });

    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(snackBar.openSnackBar).toHaveBeenCalledWith('network failed', {
      error: true,
    });
  });

  it('ignores a full-draft response after the picker is destroyed', async () => {
    const response = new Subject<unknown>();
    const apollo = {
      query: jest.fn().mockReturnValue(response),
    } as unknown as Apollo;
    const component = createComponent(apollo);

    const loadPromise = component.onClose({
      id: 'draft-id',
      createdAt: '2026-10-01T10:00:00Z',
      modifiedAt: '2026-10-01T11:00:00Z',
    });
    await Promise.resolve();
    component.ngOnDestroy();
    response.next({ data: { record: { id: 'draft-id', data: {} } } });
    response.complete();
    await loadPromise;

    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(snackBar.openSnackBar).not.toHaveBeenCalled();
  });

  it('releases the loading state when draft deletion fails', () => {
    const apollo = {
      query: jest.fn(),
    } as unknown as Apollo;
    const component = createComponent(apollo);
    (formHelpersService.deleteRecordDraft as jest.Mock).mockImplementation(
      (_id: string, _success: () => void, error: () => void) => error()
    );

    component.onDelete({
      id: 'draft-id',
      createdAt: '2026-10-01T10:00:00Z',
      modifiedAt: '2026-10-01T11:00:00Z',
    });

    expect(component.loading).toBe(false);
  });

  /**
   * Creates the component with its lightweight collaborators.
   *
   * @param apollo Mocked Apollo client
   * @returns Draft list modal component
   */
  function createComponent(apollo: Apollo): DraftRecordListModalComponent {
    return new DraftRecordListModalComponent(
      confirmService,
      translate,
      apollo,
      dialog,
      dialogRef,
      formHelpersService,
      snackBar,
      { form }
    );
  }
});
