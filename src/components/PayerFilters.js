import React from "react";
import {
  ControlledField,
  PublishedComponent,
  TextInput,
  useTranslations,
  decodeId,
  useModulesManager,
  useDebounceCb,
} from "@openimis/fe-core";
import { FormControlLabel, Grid, Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  form: {
    padding: "0 0 10px 0",
    width: "100%",
  },
  item: {
    padding: theme.spacing(1),
  },
}));

const PayerFilters = (props) => {
  const { filters, onChangeFilters } = props;
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const { formatMessage } = useTranslations("payer", modulesManager);

  const onValueChange = (id, value) => {
    onChangeFilters([{ id, value }]);
  };

  const onChangeDebounce = useDebounceCb(onValueChange, modulesManager.getConf("fe-admin", "debounceTime", 500));

  return (
    <section className={classes.form}>
      <Grid container>
        <ControlledField
          module="payer"
          id="name"
          field={
            <Grid item xs={4} className={classes.item}>
              <TextInput
                module="payer"
                name="name"
                label="name"
                value={filters?.name?.value}
                onChange={(value) => onChangeDebounce("name", value)}
              />
            </Grid>
          }
        />
        <ControlledField
          module="payer"
          id="region"
          field={
            <Grid item xs={4} className={classes.item}>
              <PublishedComponent
                pubRef="location.RegionPicker"
                value={filters.location?.value?.parent ?? filters.location?.value}
                withNull={true}
                onChange={(value) =>
                  onChangeFilters([{ id: "location", value: value, filter: value ? decodeId(value.id) : null }])
                }
              />
            </Grid>
          }
        />
        <ControlledField
          module="payer"
          id="district"
          field={
            <Grid item xs={4} className={classes.item}>
              <PublishedComponent
                pubRef="location.DistrictPicker"
                value={filters.location?.value?.parent ? filters.location?.value : null}
                region={filters.location?.value?.parent ? filters.location?.value?.parent : filters.location?.value}
                key={filters.location?.value?.parent}
                withNull={true}
                onChange={(value) => {
                  if (!value) {
                    value = filters.location?.value?.parent;
                  }
                  onChangeFilters([{ id: "location", value: value, filter: value ? decodeId(value.id) : null }]);
                }}
              />
            </Grid>
          }
        />
        <ControlledField
          module="payer"
          id="region"
          field={
            <Grid item xs={4} className={classes.item}>
              <PublishedComponent
                pubRef="payer.PayerTypePicker"
                value={filters?.type?.value}
                withNull={true}
                onChange={(value) => onChangeDebounce("type", value)}
              />
            </Grid>
          }
        />
        <ControlledField
          module="payer"
          id="email"
          field={
            <Grid item xs={4} className={classes.item}>
              <TextInput
                module="payer"
                name="email"
                label="email"
                value={filters?.email?.value}
                onChange={(value) => onChangeDebounce("email", value)}
              />
            </Grid>
          }
        />
        <ControlledField
          module="payer"
          id="phone"
          field={
            <Grid item xs={4} className={classes.item}>
              <TextInput
                module="payer"
                name="phone"
                label="phone"
                value={filters?.phone?.value}
                onChange={(value) => onChangeDebounce("phone", value)}
              />
            </Grid>
          }
        />
        <ControlledField
          module="payer"
          id="showHistory"
          field={
            <Grid item xs={12} className={classes.item}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={filters?.showHistory?.value}
                    onChange={() =>
                      onChangeFilters([
                        {
                          id: "showHistory",
                          value: !filters?.showHistory?.value,
                        },
                      ])
                    }
                  />
                }
                label={formatMessage("PayerFilters.showHistory")}
              />
            </Grid>
          }
        />
      </Grid>
    </section>
  );
};

export default PayerFilters;
