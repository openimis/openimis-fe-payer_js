import React, { useEffect } from "react";
import {
  useTranslations,
  useModulesManager,
  historyPush,
  withTooltip,
  withHistory,
  clearCurrentPaginationPage,
  GetIconComponent,
} from "@openimis/fe-core";
import { styled } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { RIGHT_PAYERS_ADD, RIGHT_PAYERS_DELETE, MODULE_NAME } from "../constants";
import { deletePayer } from "../actions";
import { Fab } from "@mui/material";
const AddIcon = GetIconComponent("Add")
import PayerSearcher from "../components/PayerSearcher";

const StyledPayersPage = styled('div')(({ theme }) => ({
  ...theme.page ?? {},
  '& .fab': theme.fab ?? {},
}));

const PayersPage = (props) => {
  const { history } = props;
  const dispatch = useDispatch();
  const modulesManager = useModulesManager();
  const { formatMessage, formatMessageWithValues } = useTranslations("payer", modulesManager);
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);
  const module = useSelector((state) => state.core?.savedPagination?.module);
  const onDoubleClick = (payer, newTab) =>
    historyPush(modulesManager, history, "payer.payersOverview", [payer.uuid], newTab);

  const onDelete = (payer) =>
    dispatch(
      deletePayer(
        modulesManager,
        payer,
        formatMessageWithValues("deleteMutation.label", { name: payer.name }),
      ),
    );

  const canDelete = (payer) => rights.includes(RIGHT_PAYERS_DELETE) && !payer.validityTo;

  useEffect(() => {
    if (module !== MODULE_NAME) dispatch(clearCurrentPaginationPage());
  }, [module]);

  return (
    <StyledPayersPage>
      <PayerSearcher onDelete={onDelete} canDelete={canDelete} onDoubleClick={onDoubleClick} />
      {rights.includes(RIGHT_PAYERS_ADD) &&
        withTooltip(
          <div className="fab">
            <Fab color="primary" onClick={() => historyPush(modulesManager, history, "payer.payersNew")}>
              <AddIcon />
            </Fab>
          </div>,
          formatMessage("PayersPage.addNewPayer"),
        )}
    </StyledPayersPage>
  );
};

export { StyledPayersPage };
export default withHistory(PayersPage);
