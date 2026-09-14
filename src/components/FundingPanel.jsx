import React, { useState } from "react";

import { Grid, Paper, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";


import { GetIconComponent, Table, useTranslations, useModulesManager } from "@openimis/fe-core";
import { usePayerFundingsQuery } from "../hooks";
import AddFundingDialog from "./AddFundingDialog";

const StyledFundingPanel = styled('div')(({ theme }) => ({
  '& .item': theme.paper?.item ?? {},
  '& .paper': theme.paper?.paper ?? {},
  '& .tableTitle': theme.table?.title ?? {},
}));
const AddIcon = GetIconComponent("Add")
const HEADERS = ["payer.payDate", "payer.product", "payer.receipt", "payer.amount"];

const FundingPanel = (props) => {
  const { edited, readOnly } = props;
  const [pagination, setPagination] = useState({ page: 0, afterCursor: null, beforeCursor: null });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const modulesManager = useModulesManager();
  const { formatMessage, formatAmount, formatDateFromISO } = useTranslations("payer", modulesManager);

  const { data, error, isLoading, refetch } = usePayerFundingsQuery(
    { variables: { payerId: edited?.uuid, first: 10, after: pagination.afterCursor, before: pagination.beforeCursor } },
    // payerId is a required variable: don't query until the payer exists (new payer form)
    { keepStale: true, skip: !edited?.uuid },
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
    <StyledFundingPanel>
      <Grid size={12}>
        <Paper className="paper">
          <Grid container className="tableTitle" justifyContent="space-between" alignItems="center">
            <Grid>
              <Typography variant="h6">{formatMessage("FundingPanel.table.title")}</Typography>
            </Grid>
            <Grid>
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
            <Grid size={12}>
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
    </StyledFundingPanel>
  );
};

export default FundingPanel;
