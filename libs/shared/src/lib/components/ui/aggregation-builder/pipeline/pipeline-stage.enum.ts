/**
 * Enum of available pipeline stage, for aggregation.
 */
export enum PipelineStage {
  FILTER = 'filter',
  SORT = 'sort',
  GROUP = 'group',
  ADD_FIELDS = 'addFields',
  UNWIND = 'unwind',
  CUSTOM = 'custom',
  LABEL = 'label',
}
