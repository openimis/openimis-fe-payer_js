import React, { useState } from "react";

import { Grid, Paper, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

import { Table, useTranslations, useModulesManager } from "@openimis/fe-core";
import { usePayerFundingsQuery } from "../hooks";
import AddFundingDialog from "./AddFundingDialog";

const useStyles = makeStyles((theme) => ({
  item: theme.paper.item,
  paper: theme.paper.paper,
  tableTitle: theme.table.title,
}));

const HEADERS = ["payer.payDate", "payer.product", "payer.receipt", "payer.amount"];

const FundingPanel = (props) => {
  const { edited, readOnly } = props;
  const [pagination, setPagination] = useState({ page: 0, afterCursor: null, beforeCursor: null });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const modulesManager = useModulesManager();
  const { formatMessage, formatAmount, formatDateFromISO } = useTranslations("payer", modulesManager);
  const classes = useStyles();

  const { data, error, isLoading, refetch } = usePayerFundingsQuery(
    { variables: { payerId: edited.uuid, first: 10, after: pagination.afterCursor, before: pagination.beforeCursor } },
    { keepStale: true },
  );

  const onDialogClose = () => {
    setDialogOpen(false);
    refetch();
  };

  // We can't show the add funding panel until the payer is created
  if (edited && !edited.id) {
    return <></>;
  }
  return (
    <>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Grid container className={classes.tableTitle} justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h6">{formatMessage("FundingPanel.table.title")}</Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => setDialogOpen(true)}
                startIcon={<AddIcon />}
                disabled={edited.validityTo || readOnly}
              >
                {formatMessage("FundingPanel.table.addFunding")}
              </Button>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <Table
                error={error}
                fetching={isLoading}
                headers={HEADERS}
                itemFormatters={[
                  (s) => formatDateFromISO(s.payDate),
                  (s) => s.product.name,
                  (s) => s.receipt,
                  (s) => formatAmount(s.amount),
                ]}
                aligns={HEADERS.map((_, i) => (i === HEADERS.length - 1 ? "right" : null))}
                items={data.fundings}
                withPagination
                page={pagination.page}
                onChangePage={(_, page) =>
                  setPagination({
                    afterCursor: page > pagination.page ? data.pageInfo.endCursor : null, // We'll load the next page
                    beforeCursor: page < pagination.page ? data.pageInfo.startCursor : null, // We'll load the previous page
                    page,
                  })
                }
                count={data.pageInfo.totalCount}
                rowsPerPage={15}
                rowsPerPageOptions={[15]}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <AddFundingDialog open={isDialogOpen} onClose={onDialogClose} payer={edited} />
    </>
  );
};

export default FundingPanel;
