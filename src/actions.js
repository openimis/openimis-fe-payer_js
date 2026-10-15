import { formatPageQueryWithCount, formatMutation, graphql, decodeId } from "@openimis/fe-core";

const PAYER_SUMMARY_PROJECTION = [
  "id",
  "uuid",
  "name",
  "email",
  "phone",
  "type",
  "address",
  "location{id name uuid code parent{id name uuid code}}",
  "validityFrom",
  "validityTo",
];

export function fetchPayersSummaries(modulesManager, params) {
  const payload = formatPageQueryWithCount("payers", params, PAYER_SUMMARY_PROJECTION);
  return graphql(payload, "PAYER_PAYERS");
}

export function deletePayer(modulesManager, payer, clientMutationLabel) {
  const mutation = formatMutation("deletePayer", `uuids: ["${payer.uuid}"]`, clientMutationLabel);
  // The row carries the id of the mutation changing it; Searcher reads the
  // journal for that id to lock the row and to re-read the page once it
  // succeeds. Without this stamp a deleted row just sits there.
  // eslint-disable-next-line no-param-reassign
  payer.clientMutationId = mutation.clientMutationId;
  const requestedDateTime = new Date();
  return graphql(mutation.payload, ["PAYER_MUTATION_REQ", "PAYER_DELETE_RESP", "PAYER_MUTATION_ERR"], {
    clientMutationId: mutation.clientMutationId,
    clientMutationLabel,
    requestedDateTime,
  });
}
