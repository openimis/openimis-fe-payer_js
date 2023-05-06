import React, { useState, useMemo } from "react";
import { Button, Dialog, DialogActions, DialogContent, Grid, DialogTitle } from "@material-ui/core";
import {
  useTranslations,
  useModulesManager,
  NumberInput,
  TextInput,
  PublishedComponent,
  decodeId,
} from "@openimis/fe-core";
import { useAddFundingMutation } from "../hooks";

const AddFundingDialog = (props) => {
  const { onClose, open, payer } = props;
  const [form, setForm] = useState({});
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("payer.AddFundingDialog", modulesManager);
  const mutation = useAddFundingMutation();

  const handleSubmit = async () => {
    await mutation.mutate({
      amount: form.amount,
      productId: decodeId(form.product.id),
      payDate: form.payDate,
      payerId: decodeId(payer.id),
      receipt: form.receipt,
    });
    onClose();
  };

  const isValid = useMemo(() => {
    if (!form.product) return false;
    if (!form.amount) return false;
    if (!form.receipt) return false;
    if (!form.payDate) return false;
    return true;
  }, [form]);

  return (
    <>
      <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose}>
        <DialogTitle>{formatMessage("title")}</DialogTitle>
        <DialogContent>
          <Grid container spacing={1} direction="column">
            <Grid item>
              <PublishedComponent
                pubRef="product.ProductPicker"
                value={form.product}
                required
                locationId={payer && payer.location ? decodeId(payer.location.id) : null }
                onChange={(product) => setForm({ ...form, product })}
              />
            </Grid>
            <Grid item>
              <NumberInput
                module="payer"
                label="amount"
                name="amount"
                value={form.amount}
                required
                onChange={(amount) => setForm({ ...form, amount })}
              />
            </Grid>
            <Grid item>
              <TextInput
                module="payer"
                label="receipt"
                name="receipt"
                value={form.receipt}
                required
                onChange={(receipt) => setForm({ ...form, receipt })}
              />
            </Grid>
            <Grid item>
              <PublishedComponent
                pubRef="core.DatePicker"
                value={form.payDate}
                module="payer"
                required
                label="payDate"
                onChange={(payDate) => setForm({ ...form, payDate })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{formatMessage("cancel")}</Button>
          <Button disabled={!isValid || mutation.isLoading} onClick={handleSubmit}>
            {formatMessage("submit")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddFundingDialog;
