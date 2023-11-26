const initialState = {
  communityResilenceSearchResults:null,
  censusTractFilterResult: null,
  searchFields: {
    states: [{ value: 'state1', label: 'state1' }, { value: 'state2', label: 'state2' }],
    county: [{ value: 'county1', label: 'county1' }, { value: 'county2', label: 'county2' }],
    fipsName: [{ value: 'fipsName', label: 'fipsName' }, { value: 'fipsName', label: 'fipsName' }],
    climateChangeImpactCategories: [{ value: 'climateChangeImpactCategories', label: 'climateChangeImpactCategories' }]
  },
  uploadFilePending: false,
  uploadFileError: null,
  isUploading: false,
  parsedData: null,
  conanData: null,
  layoutHeader: 'Spine',
  fileDownloadKey: null,
  downloadFilePending: false,
  downloadFileError: null,
  getCommunityResilenceSearchResultsPending: false,
  getCommunityResilenceSearchResultsError: null,
  postCensusTractFilterPending: false,
  postCensusTractFilterError: null,
};

export default initialState;
