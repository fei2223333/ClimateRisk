import initialState from './initialState';
import { reducer as uploadFileReducer } from './uploadFile';
import { reducer as switchHeaderReducer } from './switchHeader';
import { reducer as resetUploadReducer } from './resetUpload';

const reducers = [
  uploadFileReducer,
  switchHeaderReducer,
  resetUploadReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  /* istanbul ignore next */
  return reducers.reduce((s, r) => r(s, action), newState);
}
