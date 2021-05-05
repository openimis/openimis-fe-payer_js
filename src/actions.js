import {
  baseApiUrl, graphql, formatQuery, formatPageQuery, formatPageQueryWithCount,
  formatMutation, decodeId, openBlob, formatJsonField
} from "@openimis/fe-core";
import _ from "lodash";
import _uuid from "lodash-uuid";

export function fetchPayers(mm, filters = []) {
  const payload = formatPageQuery(
    "payers",
    null,
    mm.getRef("payer.PayerPicker.projection")
  );
  return graphql(payload, 'PAYER_PAYERS', filters);
}
