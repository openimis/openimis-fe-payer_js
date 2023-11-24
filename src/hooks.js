import { useMemo } from "react";
import { useGraphqlMutation, useGraphqlQuery, useModulesManager } from "@openimis/fe-core";
import _ from "lodash";

export const PAYER_PICKER_PROJECTION = ["id", "uuid", "name"];

export const GRAPHQL_USE_PAYER_PAYER_FRAGMENT = `
  fragment PayerFragment on PayerGQLType {
    id
    name
    phone
    fax
    email
    type
    location {id uuid name code parent {id uuid name code}}
    address
    validityFrom
    validityTo
  }
`;

export const usePayerQuery = ({ uuid }, config) => {
  const modulesManager = useModulesManager();
  const { isLoading, error, data, refetch } = useGraphqlQuery(
    `
    query usePayerQuery ($uuid: UUID) {
      payer(uuid: $uuid) {
        uuid
        ...PayerFragment
      }
    }
    ${modulesManager.getRef("payer.hooks.usePayerQuery.payerFragment")}
  `,
    { uuid },
    config,
  );

  return {
    isLoading,
    error,
    refetch,
    data: data?.payer,
  };
};

export const GRAPHQL_USE_PAYERS_PAYER_FRAGMENT = `
  fragment PayerFragment on PayerGQLType {
    id
    uuid
    name
    email
    phone
    type
    address
    location {id name uuid code parent {id name uuid code}}
    validityFrom
    validityTo
  } 
`;

export const usePayersQuery = ({ filters }, config) => {
  const modulesManager = useModulesManager();
  const { isLoading, error, data, refetch } = useGraphqlQuery(
    `
  query usePayersQuery (
    $first: Int, $last: Int, $before: String, $after: String, $phone: String, $name: String,
    $email: String, $location: Int, $showHistory: Boolean, $search: String, $type: PayerType,
    ) {
    payers (
      first: $first, last: $last, before: $before, after: $after, phone_Icontains: $phone, showHistory: $showHistory, type: $type
      name_Icontains: $name, location: $location, email_Icontains: $email, search: $search
      ) {
      edges {
        node {
          id
          uuid
          ...PayerFragment
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${modulesManager.getRef("payer.hooks.usePayersQuery.payerFragment")}
  `,
    filters,
    config,
  );

  const payers = useMemo(() => (data ? _.map(data.payers?.edges, "node") : []), [data]);
  const pageInfo = useMemo(
    () => (data ? Object.assign({ totalCount: data.payers?.totalCount }, data.payers?.pageInfo) : {}),
    [data],
  );
  return { isLoading, error, data: { payers, pageInfo }, refetch };
};

export const usePayerFundingsQuery = ({ variables }, config) => {
  const { isLoading, error, data, refetch } = useGraphqlQuery(
    `
  query usePayerFundingsQuery (
    $first: Int, $last: Int, $before: String, $after: String, $payerId: UUID!
    ) {
    payer (uuid: $payerId) {
      fundings (first: $first, last: $last, before: $before, after: $after) {
        edges {
          node {
            uuid
            amount
            payDate
            product {
              name
            }
            receipt
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        totalCount
      }
    }
  }
  `,
    variables,
    config,
  );

  const fundings = useMemo(() => (data ? _.map(data.payer?.fundings?.edges, "node") : []), [data]);
  const pageInfo = useMemo(
    () => (data ? Object.assign({ totalCount: data.payer?.fundings?.totalCount }, data.payer?.fundings?.pageInfo) : {}),
    [data],
  );
  return { isLoading, error, data: { fundings, pageInfo }, refetch };
};

export const useAddFundingMutation = () => {
  const mutation = useGraphqlMutation(
    `
    mutation useAddFundingMutation($input: AddFundingMutationInput!) {
      addFunding(input: $input) {
        internalId
        clientMutationId
      }
    }
  `,
    { onSuccess: (data) => data?.addFunding },
  );

  return mutation;
};

export const usePayerUpdateMutation = () => {
  const mutation = useGraphqlMutation(
    `
    mutation usePayerUpdateMutation($input: UpdatePayerMutationInput!) {
      updatePayer(input: $input) {
        internalId
        clientMutationId
      }
    }
  `,
    { onSuccess: (data) => data?.updatePayer },
  );

  return mutation;
};

export const usePayerCreateMutation = () => {
  const mutation = useGraphqlMutation(
    `
    mutation usePayerCreateMutation($input: CreatePayerMutationInput!) {
      createPayer(input: $input) {
        internalId
        clientMutationId
      }
    }
  `,
    { onSuccess: (data) => data?.createPayer },
  );

  return mutation;
};

export const usePayerDeleteMutation = () => {
  const mutation = useGraphqlMutation(
    `
    mutation usePayerDeleteMutation($input: DeletePayerMutationInput!) {
      deletePayer(input: $input) {
        internalId
        clientMutationId
      }
    }
  `,
    { onSuccess: (data) => data?.deletePayer },
  );

  return mutation;
};
