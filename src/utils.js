export const validatePayerForm = (values) => {
  return Boolean(values.name && values.type && values.location && values.address && !values.validityTo);
};

export const toFormValues = (payer) => payer;
export const toInputValues = (values) => ({
  uuid: values.uuid,
  name: values.name,
  locationUuid: values.location?.uuid,
  type: values.type,
  address: values.address,
  fax: values.fax,
  email: values.email,
  phone: values.phone,
});
