import React, { useState, useCallback } from "react";
import { usePayersQuery } from "../hooks";
import { Searcher, useTranslations, useModulesManager, ConfirmDialog } from "@openimis/fe-core";
import PayerFilters from "./PayerFilters";
import { Tooltip, IconButton } from "@material-ui/core";
import { Tab as TabIcon, Delete as DeleteIcon } from "@material-ui/icons";

const isRowDisabled = (_, row) => Boolean(row.validityTo);
const formatLocation = (location) => (location ? `${location.code} - ${location.name}` : null);

const PayerSearcher = (props) => {
  const { cacheFiltersKey, onDelete, canDelete, onDoubleClick } = props;
  const modulesManager = useModulesManager();
  const { formatMessage, formatDateFromISO, formatMessageWithValues } = useTranslations("payer", modulesManager);
  const [filters, setFilters] = useState({});
  const [payerToDelete, setPayerToDelete] = useState(null);
  const { data, isLoading, error, refetch } = usePayersQuery({ filters }, { skip: true, keepStale: true });
  const filtersToQueryParam = useCallback((state) => {
    let params = {};
    if (!state.beforeCursor && !state.afterCursor) {
      params = {first: state.pageSize};
    }
    if (state.afterCursor) {
      params = {
        after: state.afterCursor,
        first: state.pageSize,
      }
    }
    if (state.beforeCursor) {
      params = {
        before: state.beforeCursor,
        last: state.pageSize,
      }
    }
    Object.entries(state.filters).forEach(([filterKey, filter]) => {
      params[filterKey] = filter.filter ?? filter.value;
    });
    return params;
  }, []);

  const getHeaders = useCallback(
    () => [
      "payer.name",
      "payer.type",
      "payer.address",
      "payer.region",
      "payer.district",
      "payer.validityFrom",
      "payer.validityTo",
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
      onDelete(payerToDelete);
      refetch();
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
      (p) => formatDateFromISO(p.validityFrom),
      (p) => formatDateFromISO(p.validityTo),
      (p) =>
        !filters.showHistory?.value ? (
          <>
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
          </>
        ) : null,
    ];
  }, []);
  return (
    <>
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
        tableTitle={formatMessageWithValues("PayerSearcher.tableTitle", { count: data?.pageInfo?.totalCount ?? 0 })}
        cacheFiltersKey={cacheFiltersKey}
        items={data.payers}
        fetchingItems={isLoading}
        errorItems={error}
        itemsPageInfo={data.pageInfo}
        fetch={setFilters}
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
    </>
  );
};

export default PayerSearcher;
