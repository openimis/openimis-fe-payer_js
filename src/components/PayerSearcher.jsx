import React, { useState, useCallback } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Tooltip, IconButton } from "@mui/material";
import { GetIconComponent } from "@openimis/fe-core";
const TabIcon = GetIconComponent("Tab")
const DeleteIcon = GetIconComponent("Delete")

import { styled } from "@mui/material/styles";

import { Searcher, useTranslations, useModulesManager, ConfirmDialog } from "@openimis/fe-core";
import { fetchPayersSummaries } from "../actions";
import PayerFilters from "./PayerFilters";

// Each filter as the server expects it. The pane keeps emitting {id, value};
// turning those into GraphQL filters belongs here rather than in the pane.
const FILTER_TO_QUERY = {
  name: (v) => (v ? `name_Icontains: "${v}"` : null),
  email: (v) => (v ? `email_Icontains: "${v}"` : null),
  phone: (v) => (v ? `phone_Icontains: "${v}"` : null),
  type: (v) => (v ? `type: "${v}"` : null),
  showHistory: (v) => (v ? `showHistory: true` : null),
};

const isRowDisabled = (_, row) => Boolean(row.validityTo);
const formatLocation = (location) => (location ? `${location.code} - ${location.name}` : null);

const StyledPayerSearcher = styled('div')(({ theme }) => ({
  '& .horizontalButtonContainer': theme.buttonContainer?.horizontal ?? {},
}));

const PayerSearcher = (props) => {
  const { cacheFiltersKey, onDelete, canDelete, onDoubleClick } = props;
  const modulesManager = useModulesManager();
  const { formatMessage, formatDateFromISO, formatMessageWithValues } = useTranslations("payer", modulesManager);
  const [payerToDelete, setPayerToDelete] = useState(null);
  const { payers, payersPageInfo, fetchingPayers, errorPayers, fetchPayersSummaries } = props;

  const fetch = useCallback((params) => fetchPayersSummaries(modulesManager, params), [modulesManager]);

  const filtersToQueryParam = useCallback((state) => {
    const prms = [];
    if (!state.beforeCursor && !state.afterCursor) {
      prms.push(`first: ${state.pageSize}`);
    }
    if (state.afterCursor) {
      prms.push(`after: "${state.afterCursor}"`, `first: ${state.pageSize}`);
    }
    if (state.beforeCursor) {
      prms.push(`before: "${state.beforeCursor}"`, `last: ${state.pageSize}`);
    }
    if (state.orderBy) {
      prms.push(`orderBy: ["${state.orderBy}"]`);
    }
    Object.entries(state.filters ?? {}).forEach(([key, filter]) => {
      // The location pane already hands over a decoded id in `filter`.
      if (key === "location") {
        if (filter.filter) prms.push(`location: ${filter.filter}`);
        return;
      }
      const build = FILTER_TO_QUERY[key];
      const clause = build ? build(filter.value) : filter.filter;
      if (clause) prms.push(clause);
    });
    return prms;
  }, []);

  const getHeaders = useCallback(
    (filters) => [
      "payer.name",
      "payer.type",
      "payer.address",
      "payer.region",
      "payer.district",
      filters?.showHistory?.value ? "payer.validityFrom" : null,
      filters?.showHistory?.value ? "payer.validityTo" : null,
      "",
    ],
    [],
  );
  const getAligns = useCallback(() => {
    const aligns = getHeaders().map(() => null);
    aligns.splice(-1, 1, "right");
    return aligns;
  }, []);

  const onDeleteConfirm = (isConfirmed) => {
    if (isConfirmed) {
      // No refetch here. It used to run straight after a mutation that was not
      // awaited, so it raced the request; and with async mutations even the
      // response only means "queued". The row is locked on its
      // clientMutationId and Searcher re-reads the page once the journal
      // reports success.
      onDelete(payerToDelete);
    }
    setPayerToDelete(null);
  };

  const itemFormatters = useCallback((filters) => {
    return [
      (p) => p.name,
      (p) => formatMessage(`payer.type.${p.type}`),
      (p) => p.address,
      (p) => formatLocation(p.location?.parent ?? p.location),
      (p) => formatLocation(p.location?.parent ? p.location : null),
      (p) => (filters?.showHistory?.value ? formatDateFromISO(p.validityFrom) : null),
      (p) => (filters?.showHistory?.value ? formatDateFromISO(p.validityTo) : null),
      (p) => (
        <div className="horizontalButtonContainer">
          <Tooltip title={formatMessage("PayerSearcher.openNewTab")}>
            <IconButton onClick={() => onDoubleClick(p, true)}>
              <TabIcon />
            </IconButton>
          </Tooltip>
          {canDelete(p) && (
            <Tooltip title={formatMessage("PayerSearcher.deletePayerTooltip")}>
              <IconButton onClick={() => setPayerToDelete(p)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ),
    ];
  }, []);
  return (
    <StyledPayerSearcher>
      {payerToDelete && (
        <ConfirmDialog
          confirm={{
            title: formatMessage("deletePayerDialog.title"),
            message: formatMessageWithValues("deletePayerDialog.message", { name: payerToDelete.name }),
          }}
          onConfirm={onDeleteConfirm}
        />
      )}
      <Searcher
        module="payer"
        tableTitle={formatMessageWithValues("PayerSearcher.tableTitle", { count: payersPageInfo?.totalCount ?? 0 })}
        cacheFiltersKey={cacheFiltersKey}
        items={payers}
        fetchingItems={fetchingPayers}
        errorItems={errorPayers}
        itemsPageInfo={payersPageInfo}
        fetch={fetch}
        onDelete={onDelete}
        canDelete={canDelete}
        onDoubleClick={onDoubleClick}
        FilterPane={PayerFilters}
        headers={getHeaders}
        aligns={getAligns}
        rowDisabled={isRowDisabled}
        rowIdentifier={(r) => r.uuid}
        filtersToQueryParams={filtersToQueryParam}
        itemFormatters={itemFormatters}
      />
    </StyledPayerSearcher>
  );
};

const mapStateToProps = (state) => ({
  payers: state.payer.payers,
  payersPageInfo: state.payer.payersPageInfo,
  fetchingPayers: state.payer.fetchingPayers,
  fetchedPayers: state.payer.fetchedPayers,
  errorPayers: state.payer.errorPayers,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchPayersSummaries }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PayerSearcher);
