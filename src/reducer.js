import {
  parseData,
  pageInfo,
  formatServerError,
  formatGraphQLError,
  dispatchMutationReq,
  dispatchMutationResp,
  dispatchMutationErr,
  dispatchMutationDefault,
} from "@openimis/fe-core";

function reducer(
  state = {
    fetchingPayers: false,
    fetchedPayers: false,
    errorPayers: null,
    payers: [],
    payersPageInfo: { totalCount: 0 },
    submittingMutation: false,
    mutation: {},
  },
  action,
) {
  switch (action.type) {
    case "PAYER_PAYERS_REQ":
      return {
        ...state,
        fetchingPayers: true,
        fetchedPayers: false,
        payers: [],
        payersPageInfo: { totalCount: 0 },
        errorPayers: null,
      };
    case "PAYER_PAYERS_RESP":
      return {
        ...state,
        fetchingPayers: false,
        fetchedPayers: true,
        payers: parseData(action.payload.data.payers),
        payersPageInfo: pageInfo(action.payload.data.payers),
        errorPayers: formatGraphQLError(action.payload),
      };
    case "PAYER_PAYERS_ERR":
      return {
        ...state,
        fetchingPayers: false,
        errorPayers: formatServerError(action.payload),
      };
    case "PAYER_MUTATION_REQ":
      return dispatchMutationReq(state, action);
    case "PAYER_MUTATION_ERR":
      return dispatchMutationErr(state, action);
    case "PAYER_DELETE_RESP":
      return dispatchMutationResp(state, "deletePayer", action);
    default:
      // A mutation response with no case of its own still clears
      // submittingMutation, so a forgotten case cannot wedge this module.
      return dispatchMutationDefault(state, action);
  }
}

export default reducer;
