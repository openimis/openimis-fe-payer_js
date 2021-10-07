import React, { useState, useMemo } from "react";
import { Box, Dialog, DialogActions, DialogTitle, DialogContent, Button } from "@material-ui/core";
import { usePayerAddFundingMutation } from "../hooks";
import {
  useTranslations,
  useModulesManager,
  PublishedComponent,
  TextInput,
  NumberInput,
  decodeId,
  ProgressOrError,
} from "@openimis/fe-core";

const AddFundingDialog = (props) => {
  const { payer, open, onClose } = props;
  const [values, setValues] = useState({});

  const modulesManager = useModulesManager();
  const { formatMessageWithValues, formatMessage } = useTranslations("payer", modulesManager);
  const { error, mutate, isLoading } = usePayerAddFundingMutation({ waitForMutation: true });

  const onSubmit = async () => {
    try {
      await mutate({
        payerId: decodeId(payer.id),
        productId: decodeId(values.product.id),
        receipt: values.receipt,
        amount: values.amount,
        payDate: values.payDate,
      });
      setValues({});
      onClose(true);
    } catch (err) {
      console.error(err);
    }
  };

  const isValid = useMemo(() => Boolean(values.product && values.amount && values.payDate), [values]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{formatMessageWithValues("AddFundingDialog.title", { name: payer.name })}</DialogTitle>
      <DialogContent>
        <ProgressOrError error={error} progress={isLoading} />
        {!isLoading && (
          <>
            <Box mb={2}>
              <PublishedComponent
                pubRef="product.ProductPicker"
                value={values.product}
                onChange={(product) => setValues({ ...values, product })}
                locationId={decodeId(payer.location.parent?.id ?? payer.location.id)}
                fullWidth
                required
              />
            </Box>
            <Box my={2}>
              <TextInput
                module="payer"
                label="funding.receipt"
                fullWidth
                value={values.receipt}
                onChange={(receipt) => setValues({ ...values, receipt })}
              />
            </Box>
            <Box my={2}>
              <NumberInput
                module="payer"
                label="funding.amount"
                fullWidth
                required
                value={values.amount}
                onChange={(amount) => setValues({ ...values, amount })}
              />
            </Box>
            <Box mt={2}>
              <PublishedComponent
                pubRef="core.DatePicker"
                value={values.payDate}
                module="payer"
                label="funding.payDate"
                required
                onChange={(payDate) => setValues({ ...values, payDate })}
              />
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{formatMessage("AddFundingDialog.cancel")}</Button>
        <Button disabled={!isValid || isLoading} onClick={onSubmit} color="primary">
          {formatMessage("AddFundingDialog.submit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFundingDialog;
