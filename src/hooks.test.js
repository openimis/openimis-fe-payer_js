import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

const core = vi.hoisted(() => ({
  useGraphqlQuery: vi.fn(),
  useGraphqlMutation: vi.fn((operation) => ({ operation })),
  useModulesManager: vi.fn(),
}));

vi.mock("@openimis/fe-core", async () => ({
  ...(await vi.importActual("@openimis/fe-core/helpers/api")),
  ...core,
}));

const hooks = await import("./hooks");
const { relayPage } = await import("@openimis/fe-core/testing");

const refs = {
  "payer.hooks.usePayerQuery.payerFragment": hooks.GRAPHQL_USE_PAYER_PAYER_FRAGMENT,
  "payer.hooks.usePayersQuery.payerFragment": hooks.GRAPHQL_USE_PAYERS_PAYER_FRAGMENT,
};
const answer = (data) => {
  core.useModulesManager.mockReturnValue({ getRef: (key) => refs[key] });
  core.useGraphqlQuery.mockReturnValue({
    isLoading: false,
    error: null,
    data,
    refetch: vi.fn(),
  });
};
const sentOperation = () => core.useGraphqlQuery.mock.calls[0][0].replace(/\s+/g, " ");

describe("payer hooks", () => {
  describe("usePayerQuery", () => {
    it("asks for one payer by uuid with the contributed fragment", () => {
      answer({ payer: { uuid: "payer-1", name: "MoH" } });

      const { result } = renderHook(() => hooks.usePayerQuery({ uuid: "payer-1" }, { skip: false }));

      expect(sentOperation()).toContain("payer(uuid: $uuid) { uuid ...PayerFragment }");
      expect(sentOperation()).toContain("fragment PayerFragment on PayerGQLType");
      expect(core.useGraphqlQuery.mock.calls[0].slice(1)).toEqual([{ uuid: "payer-1" }, { skip: false }]);
      expect(result.current.data).toEqual({ uuid: "payer-1", name: "MoH" });
    });

    it("returns no payer before the query answers", () => {
      answer(null);

      expect(renderHook(() => hooks.usePayerQuery({ uuid: "payer-1" })).result.current.data).toBeUndefined();
    });
  });

  describe("usePayersQuery", () => {
    it("unwraps the page into rows and page info", () => {
      answer({
        payers: relayPage([{ uuid: "p-1" }, { uuid: "p-2" }], { totalCount: 12, pageInfo: { hasNextPage: true } }),
      });

      const { result } = renderHook(() => hooks.usePayersQuery({ filters: { first: 10 } }));

      expect(core.useGraphqlQuery.mock.calls[0][1]).toEqual({ first: 10 });
      expect(sentOperation()).toContain("fragment PayerFragment on PayerGQLType");
      expect(result.current.data.payers).toEqual([{ uuid: "p-1" }, { uuid: "p-2" }]);
      expect(result.current.data.pageInfo).toMatchObject({ totalCount: 12, hasNextPage: true });
    });

    it("reports an empty page before the query answers", () => {
      answer(null);

      expect(renderHook(() => hooks.usePayersQuery({ filters: {} })).result.current.data).toEqual({
        payers: [],
        pageInfo: {},
      });
    });
  });

  describe("usePayerFundingsQuery", () => {
    it("unwraps the fundings of the payer", () => {
      answer({ payer: { fundings: relayPage([{ uuid: "f-1", amount: "100.00" }], { totalCount: 1 }) } });

      const { result } = renderHook(() => hooks.usePayerFundingsQuery({ variables: { payerId: "payer-1" } }));

      expect(sentOperation()).toContain("payer (uuid: $payerId) { fundings (");
      expect(result.current.data.fundings).toEqual([{ uuid: "f-1", amount: "100.00" }]);
      expect(result.current.data.pageInfo).toMatchObject({ totalCount: 1 });
    });

    it("reports no fundings for a payer that has none", () => {
      answer({ payer: null });

      expect(renderHook(() => hooks.usePayerFundingsQuery({ variables: {} })).result.current.data.fundings).toEqual([]);
    });
  });

  it.each([
    ["useAddFundingMutation", "AddFundingMutationInput", "addFunding"],
    ["usePayerCreateMutation", "CreatePayerMutationInput", "createPayer"],
    ["usePayerUpdateMutation", "UpdatePayerMutationInput", "updatePayer"],
    ["usePayerDeleteMutation", "DeletePayerMutationInput", "deletePayer"],
  ])("%s sends a %s to %s", (hook, inputType, field) => {
    const { result } = renderHook(() => hooks[hook]());
    const { operation } = result.current;

    expect(operation.replace(/\s+/g, " ")).toContain(`($input: ${inputType}!) { ${field}(input: $input) {`);
  });
});
