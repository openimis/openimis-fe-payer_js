import React from "react";

import { Form } from "@openimis/fe-core";
import MainPanelForm from "./MainPanelForm";
import FundingPanel from "./FundingPanel";
import ReplayIcon from "@material-ui/icons/Replay";

const PayerForm = (props) => {
  const { readOnly, onBack, onSave, payer, canSave, onReset, onChange } = props;
  return (
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
      actions={[
        {
          doIt: onReset,
          icon: <ReplayIcon />,
          onlyIfDirty: !readOnly,
        },
      ]}
    />
  );
};
export default PayerForm;
