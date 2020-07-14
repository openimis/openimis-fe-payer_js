import messages_en from "./translations/en.json";
import PayerPicker from "./pickers/PayerPicker";
import reducer from "./reducer";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: messages_en }],
  "reducers": [{ key: 'payer', reducer }],
  "refs" : [
    { key: "payer.PayerPicker", ref: PayerPicker },
    { key: "payer.PayerPicker.projection", ref: ["id", "uuid", "name"] }
  ]
}

export const PayerModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}