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
  const requestedDateTime = new Date();
  return graphql(mutation.payload, ["PAYER_MUTATION_REQ", "PAYER_DELETE_RESP", "PAYER_MUTATION_ERR"], {
    clientMutationId: mutation.clientMutationId,
    uuids: [payer.uuid],
    clientMutationLabel,
    requestedDateTime,
  });
}
