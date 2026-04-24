import { getDataKeys, getRelatedDataKeys } from './keys';

describe('calculated field editor keys', () => {
  it('returns data field placeholders', () => {
    expect(getDataKeys([{ name: 'status' }, { name: 'grade' }])).toEqual([
      '{{data.status}}',
      '{{data.status:text}}',
      '{{data.grade}}',
      '{{data.grade:text}}',
    ]);
  });

  it('returns related child selector placeholders', () => {
    expect(
      getRelatedDataKeys(
        [
          {
            fields: [
              {
                name: 'emergency',
                resource: 'resource-1',
                relatedName: 'emergencygrades',
              },
            ],
            resource: {
              id: 'resource-2',
              fields: [
                { name: 'grade' },
                { name: 'modifieddate' },
                { name: 'latest_grade', isCalculated: true },
              ],
            },
          },
        ],
        'resource-1'
      )
    ).toEqual([
      '{{data.emergencygrades(first: 1, sortField: "grade", sortOrder: "desc").grade}}',
      '{{data.emergencygrades(first: 1, sortField: "modifieddate", sortOrder: "desc").modifieddate}}',
    ]);
  });
});
