import React, { useState, useEffect } from "react";
import { Table, useModulesManager, useTranslations } from "@openimis/fe-core";
import { Paper, Grid, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";
import { RIGHT_PAYERS_ADD, RIGHT_PAYERS_EDIT } from "../constants";
import { usePayerFundingsQuery } from "../hooks";
import AddFundingDialog from "./AddFundingDialog";

const useStyles = makeStyles((theme) => ({
  paper: theme.paper.paper,
  item: theme.paper.item,
  tableTitle: theme.table.title,
}));

const HEADERS = ["payer.funding.payDate", "payer.funding.product", "payer.funding.receipt", "payer.funding.amount"];
const ALIGNS = ["left", "left", "left", "right"];

const FundingsPanel = (props) => {
  const { edited_id, edited, pageSize = 10 } = props;
  const modulesManager = useModulesManager();
  const rights = useSelector((state) =>
    !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  );
  const { formatMessage, formatDateFromISO, formatMessageWithValues } = useTranslations("payer", modulesManager);
  const [pagination, setPagination] = useState({ page: 0, first: pageSize });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const classes = useStyles();

  const { isLoading, data, error, refetch } = usePayerFundingsQuery({
    payerId: edited_id,
    first: pagination.first,
    last: pagination.last,
    before: pagination.before,
    after: pagination.after,
  });

  const onChangePage = (_, page) => {
    if (page > pagination.page) {
      // We'll load the next page
      setPagination({
        page,
        after: data.pageInfo.endCursor,
        first: pageSize,
      });
    } else if (page < pagination.page) {
      // We'll load the previous page
      setPagination({
        page,
        before: data.pageInfo.startCursor,
        last: pageSize,
      });
    }
  };

  useEffect(() => {
    if (!isDialogOpen) {
      // Refetch to receive new fundings
      if (pagination.page > 0) {
        setPagination({ page: 0, first: pageSize });
      } else {
        refetch();
      }
    }
  }, [isDialogOpen]);

  if (!edited_id) {
    return null;
  }

  return (
    <>
      {edited && <AddFundingDialog payer={edited} open={isDialogOpen} onClose={() => setDialogOpen(false)} />}
      <Paper className={classes.paper}>
        <Grid container className={classes.tableTitle} alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            {isLoading
              ? formatMessage("FundingsPanel.table.isLoading")
              : formatMessageWithValues("FundingsPanel.table.title", { count: data?.totalCount ?? 0 })}
          </Typography>
          {[RIGHT_PAYERS_ADD, RIGHT_PAYERS_EDIT].some((x) => rights.includes(x)) && (
            <Button size="small" variant="contained" onClick={() => setDialogOpen(!isDialogOpen)}>
              {formatMessage("FundingsPanel.table.addFundingButton")}
            </Button>
          )}
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <Table
              error={error}
              fetching={isLoading}
              headers={HEADERS}
              aligns={ALIGNS}
              count={data.totalCount}
              itemFormatters={[
                (funding) => formatDateFromISO(funding.payDate),
                (funding) => `${funding.product.code} ${funding.product.name}`,
                (funding) => funding.receipt,
                (funding) => funding.amount,
              ]}
              items={data.items}
              withPagination
              page={pagination.page}
              onChangePage={onChangePage}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default FundingsPanel;
