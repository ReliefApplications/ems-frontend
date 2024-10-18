/** Model for Distribution List object */
export interface DistributionList {
  id?: string;
  name: string;
  emails: string[];
  to?: string[];
  cc?: string[];
  bcc?: string[];
}

/** Model for add distribution list mutation response */
export interface AddDistributionListMutationResponse {
  addDistributionList: DistributionList;
}

/** Model for edit distribution list mutation response */
export interface UpdateDistributionListMutationResponse {
  editDistributionList: DistributionList;
}

/** Model for delete distribution list mutation response */
export interface DeleteDistributionListMutationResponse {
  deleteDistributionList: DistributionList;
}
