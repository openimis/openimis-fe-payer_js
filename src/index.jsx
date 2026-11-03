import React from "react";
import messages_en from "./translations/en.json";
import PayerPicker from "./pickers/PayerPicker";
import PayerTypePicker from "./pickers/PayerTypePicker";
import { GetIconComponent, FormattedMessage } from "@openimis/fe-core";
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
import reducer from "./reducer";
const AccountBalance = GetIconComponent("AccountBalance")

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: messages_en }],
  "reducers": [{ key: "payer", reducer }],
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
    { path: "payer/payers", text: "payer.adminMenu.payers.title", id: 'admin.payers',component: PayersPage, rights: [RIGHT_PAYERS], icon: "AccountBalance" },
    { path: "payer/payers/new", component: PayerDetailsPage, rights: [RIGHT_PAYERS], icon: "AccountBalance" },
    { path: `payer/payers/overview/:payer_id`, component: PayerDetailsPage, rights: [RIGHT_PAYERS], icon: "AccountBalance" },
  ],
  "admin.MainMenu": [
    {
      route: "payer/payers",
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
