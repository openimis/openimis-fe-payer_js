import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { useModulesManager, useTranslations, withHistory, historyPush, ProgressOrError } from "@openimis/fe-core";
import { makeStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";
import { RIGHT_PAYERS_ADD, RIGHT_PAYERS_EDIT } from "../constants";
import { usePayerQuery, usePayerCreateMutation, usePayerUpdateMutation } from "../hooks";
import { validatePayerForm, toFormValues, toInputValues } from "../utils";
import PayerForm from "../components/PayerForm";

const useStyles = makeStyles((theme) => ({
  page: theme.page,
  fab: theme.fab,
  locked: theme.page.locked,
}));

const PayerDetailsPage = (props) => {
  const { match, history } = props;
  const modulesManager = useModulesManager();
  const { formatMessageWithValues } = useTranslations("payer", modulesManager);
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);
  const { error, data, isLoading, refetch } = usePayerQuery(
    { uuid: match.params.payer_id },
    { skip: !match.params.payer_id },
  );
  const [resetKey, setResetKey] = useState(0);
  const [isLocked, setLocked] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [values, setValues] = useState({});
  const classes = useStyles();

  const createMutation = usePayerCreateMutation();
  const updateMutation = usePayerUpdateMutation();

  const onSave = () => {
    setLocked(true);
    const input = toInputValues(values);
    if (values.uuid) {
      updateMutation.mutate({
        ...input,
        clientMutationLabel: formatMessageWithValues("updateMutation.label", { name: values.name }),
      });
    } else {
      createMutation.mutate({
        ...input,
        clientMutationLabel: formatMessageWithValues("createMutation.label", { name: values.name }),
      });
    }
  };

  const onReset = () => {
    setResetKey(Date.now());
    setValues(toFormValues(data ?? {}));
    if (match.params.payer_id) {
      refetch();
    }
    setLocked(false);
  };

  useEffect(() => {
    if (!isLoading) {
      setValues(toFormValues(data ?? {}));
      setLoaded(true);
    }
  }, [data, isLoading]);

  return (
    <div className={clsx(classes.page, isLocked && classes.locked)}>
      <ProgressOrError error={error} />
      {isLoaded && (
        <PayerForm
          readOnly={
            !rights.some((x) => [RIGHT_PAYERS_ADD, RIGHT_PAYERS_EDIT].includes(x)) || isLocked || values.validityTo
          }
          key={resetKey}
          onChange={setValues}
          payer={values}
          canSave={() => validatePayerForm(values)}
          onBack={() => historyPush(modulesManager, history, "payer.payers")}
          onSave={rights.includes(RIGHT_PAYERS_EDIT) ? onSave : undefined}
          onReset={onReset}
        />
      )}
    </div>
  );
};

export default withHistory(PayerDetailsPage);
