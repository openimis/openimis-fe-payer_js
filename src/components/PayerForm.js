import React from "react";
import clsx from "clsx";

import { makeStyles } from "@material-ui/styles";
import ReplayIcon from "@material-ui/icons/Replay";

import { Form, ProgressOrError } from "@openimis/fe-core";
import FundingPanel from "./FundingPanel";
import MainPanelForm from "./MainPanelForm";

const useStyles = makeStyles((theme) => ({
  page: theme.page,
  fab: theme.fab,
  locked: theme.page.locked,
}));

const PayerForm = ({ readOnly, onBack, onSave, payer, canSave, onReset, onChange, error }) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.page, readOnly && classes.locked)}>
      <ProgressOrError error={error} />
      <Form
        module="payer"
        title={payer?.uuid ? "payer.PayerForm.title" : "payer.PayerForm.emptyTitle"}
        titleParams={{ label: payer.name ?? "" }}
        readOnly={readOnly}
        canSave={canSave}
        onEditedChanged={onChange}
        edited={payer}
        edited_id={payer.uuid}
        HeadPanel={MainPanelForm}
        Panels={[FundingPanel]}
        save={onSave}
        back={onBack}
        openDirty={onSave}
        actions={[
          {
            doIt: onReset,
            icon: <ReplayIcon />,
            onlyIfDirty: !readOnly,
          },
        ]}
      />
    </div>
  );
};
export default PayerForm;
