import React from "react";
import messages_en from "./translations/en.json";
import PayerPicker from "./pickers/PayerPicker";
import PayerTypePicker from "./pickers/PayerTypePicker";
import AccountBalance from "@material-ui/icons/AccountBalance";
import { FormattedMessage } from "@openimis/fe-core";
import PayerDetailsPage from "./pages/PayerDetailsPage";
import PayersPage from "./pages/PayersPage";
import {
  GRAPHQL_USE_PAYERS_PAYER_FRAGMENT,
  usePayersQuery,
  usePayerQuery,
  GRAPHQL_USE_PAYER_PAYER_FRAGMENT,
  PAYER_PICKER_PROJECTION
} from "./hooks";
import { RIGHT_PAYERS } from "./constants";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: messages_en }],
  "refs": [
    { key: "payer.PayerPicker", ref: PayerPicker },
    { key: "payer.PayerPicker.projection", ref: PAYER_PICKER_PROJECTION },
    { key: "payer.PayerTypePicker", ref: PayerTypePicker },
    { key: "payer.payersNew", ref: "payer/payers/new" },
    { key: "payer.payersOverview", ref: "payer/payers/overview" },
    { key: "payer.payers", ref: "payer/payers" },
    { key: "payer.hooks.usePayersQuery", ref: usePayersQuery },
    { key: "payer.hooks.usePayersQuery.payerFragment", ref: GRAPHQL_USE_PAYERS_PAYER_FRAGMENT },
    { key: "payer.hooks.usePayerQuery", ref: usePayerQuery },
    { key: "payer.hooks.usePayerQuery.payerFragment", ref: GRAPHQL_USE_PAYER_PAYER_FRAGMENT },
  ],

  "core.Router": [
    { path: "payer/payers", component: PayersPage },
    { path: "payer/payers/new", component: PayerDetailsPage },
    { path: `payer/payers/overview/:payer_id`, component: PayerDetailsPage },
  ],
  "admin.MainMenu": [
    {
      text: <FormattedMessage module="payer" id="adminMenu.payers.title" />,
      icon: <AccountBalance />,
      route: "/payer/payers",
      filter: (rights) => rights.includes(RIGHT_PAYERS),
    },
  ],
  "invoice.SubjectAndThirdpartyPicker": [
    {
      type: "payer",
      picker: PayerPicker,
      pickerProjection: PAYER_PICKER_PROJECTION,
    }
  ],
};

export const PayerModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
};
