import React, { useEffect } from "react";
import {
  useTranslations,
  useModulesManager,
  historyPush,
  withTooltip,
  withHistory,
  clearCurrentPaginationPage,
} from "@openimis/fe-core";
import { makeStyles } from "@material-ui/styles";
import { useSelector, useDispatch } from "react-redux";
import { RIGHT_PAYERS_ADD, RIGHT_PAYERS_DELETE, MODULE_NAME } from "../constants";
import { usePayerDeleteMutation } from "../hooks";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import PayerSearcher from "../components/PayerSearcher";

const useStyles = makeStyles((theme) => ({
  page: theme.page,
  fab: theme.fab,
}));

const PayersPage = (props) => {
  const { history } = props;
  const dispatch = useDispatch();
  const modulesManager = useModulesManager();
  const { formatMessage, formatMessageWithValues } = useTranslations("payer", modulesManager);
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);
  const module = useSelector((state) => state.core?.savedPagination?.module);
  const classes = useStyles();
  const deleteMutation = usePayerDeleteMutation();
  const onDoubleClick = (payer, newTab) =>
    historyPush(modulesManager, history, "payer.payersOverview", [payer.uuid], newTab);

  const onDelete = async ({ uuid, name }) => {
    await deleteMutation.mutate({
      uuids: [uuid],
      clientMutationLabel: formatMessageWithValues("deleteMutation.label", { name }),
    });
  };

  const canDelete = (payer) => rights.includes(RIGHT_PAYERS_DELETE) && !payer.validityTo;

  useEffect(() => {
    if (module !== MODULE_NAME) dispatch(clearCurrentPaginationPage());
  }, [module]);

  return (
    <div className={classes.page}>
      <PayerSearcher onDelete={onDelete} canDelete={canDelete} onDoubleClick={onDoubleClick} />
      {rights.includes(RIGHT_PAYERS_ADD) &&
        withTooltip(
          <div className={classes.fab}>
            <Fab color="primary" onClick={() => historyPush(modulesManager, history, "payer.payersNew")}>
              <AddIcon />
            </Fab>
          </div>,
          formatMessage("PayersPage.addNewPayer"),
        )}
    </div>
  );
};

export default withHistory(PayersPage);
