import React, { useEffect, useState } from "react";
import { Autocomplete, useModulesManager, useTranslations } from "@openimis/fe-core";
import { usePayersQuery } from "../hooks";

const PayerPicker = (props) => {
  const {
    onChange,
    readOnly = false,
    required = false,
    withLabel = true,
    value,
    label,
    filterOptions,
    filterSelectedOptions,
    placeholder,
    multiple = false,
  } = props;
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("payer.PayerPicker", modulesManager);
  const [searchString, setSearchString] = useState(null);
  const { isLoading, data } = usePayersQuery({ filters: { name: searchString, first: 10 } }, { skip: true });

  const options = data?.payers ?? [];

  return (
    <Autocomplete
      multiple={multiple}
      required={required}
      placeholder={placeholder}
      label={label ?? formatMessage("label")}
      withLabel={withLabel}
      readOnly={readOnly}
      options={options}
      isLoading={isLoading}
      value={value}
      getOptionLabel={(o) => o?.name}
      onChange={onChange}
      filterOptions={filterOptions}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={setSearchString}
    />
  );
};

export default PayerPicker;
