import {
  baseApiUrl, graphql, formatQuery, formatPageQuery, formatPageQueryWithCount,
  formatMutation, decodeId, openBlob, formatJsonField
} from "@openimis/fe-core";
import _ from "lodash";
import _uuid from "lodash-uuid";

export function fetchPayers(mm,  hf, str, prev) {
  var filters = [];
  if (!!hf) {
    filters.push(`healthFacility_Uuid: "${hf.uuid}"`)
  }
  if (!!str) {
    filters.push(`str: "${str}"`)
  }
  if (_.isEqual(filters, prev)) {
    return (dispatch) => { }
  }
  const payload = formatPageQuery(
    "payers",
    filters,
    mm.getRef("payer.PayerPicker.projection")
  );
  return graphql(payload, 'PAYER_PAYERS', filters);
}
