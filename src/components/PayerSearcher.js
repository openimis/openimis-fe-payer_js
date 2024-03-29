import React, { useState, useCallback } from "react";

import { Tooltip, IconButton } from "@material-ui/core";
import { Tab as TabIcon, Delete as DeleteIcon } from "@material-ui/icons";
import { withTheme, withStyles } from "@material-ui/core/styles";

import { Searcher, useTranslations, useModulesManager, combine, ConfirmDialog } from "@openimis/fe-core";
import { usePayersQuery } from "../hooks";
import PayerFilters from "./PayerFilters";

const isRowDisabled = (_, row) => Boolean(row.validityTo);
const formatLocation = (location) => (location ? `${location.code} - ${location.name}` : null);

const styles = (theme) => ({
  horizontalButtonContainer: theme.buttonContainer.horizontal,
});

const PayerSearcher = (props) => {
  const { cacheFiltersKey, classes, onDelete, canDelete, onDoubleClick } = props;
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
      (p) => (filters?.showHistory?.value ? formatDateFromISO(p.validityFrom) : null),
      (p) => (filters?.showHistory?.value ? formatDateFromISO(p.validityTo) : null),
      (p) => (
        <div className={classes.horizontalButtonContainer}>
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

const enhance = combine(withTheme, withStyles(styles));

export default enhance(PayerSearcher);
