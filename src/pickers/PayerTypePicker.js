import React from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";
import { PAYER_TYPES } from "../constants";

const PayerTypePicker = (props) => {
  return <ConstantBasedPicker module="payer" label="type" constants={PAYER_TYPES} {...props} />;
};

export default PayerTypePicker;
