import {
    parseData, dispatchMutationReq, dispatchMutationResp, dispatchMutationErr,
    pageInfo, formatServerError, formatGraphQLError
} from '@openimis/fe-core';

function reducer(
    state = {
        fetchingPayers: false,
        fetchedPayers: null,
        errorPayers: null,
        payers: null,
    },
    action,
) {
    switch (action.type) {
        case 'PAYER_PAYERS_REQ':
            return {
                ...state,
                fetchingPayers: true,
                fetchedPayers: null,
                payers: null,
                errorPayers: null,
            };
        case 'PAYER_PAYERS_RESP':
            return {
                ...state,
                fetchingPayers: false,
                fetchedPayers: action.meta,
                payers: parseData(action.payload.data.payers),
                errorPayers: formatGraphQLError(action.payload)
            };
        case 'PAYER_PAYERS_ERR':
            return {
                ...state,
                fetchingPayers: null,
                errorPayers: formatServerError(action.payload)
            };
        default:
            return state;
    }
}

export default reducer;
