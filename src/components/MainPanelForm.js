import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { TextInput, PublishedComponent } from "@openimis/fe-core";

const useStyles = makeStyles((theme) => ({
  item: theme.paper.item,
}));

const MainPanelForm = (props) => {
  const { edited, onEditedChanged, readOnly } = props;
  const classes = useStyles();
  return (
    <Grid container direction="row">
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="payer"
          required
          label="name"
          readOnly={readOnly}
          value={edited?.name ?? ""}
          onChange={(name) => onEditedChanged({ ...edited, name })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <PublishedComponent
          pubRef="payer.PayerTypePicker"
          value={edited.type}
          required
          readOnly={readOnly}
          withNull={false}
          onChange={(type) => onEditedChanged({ ...edited, type })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <PublishedComponent
          pubRef="location.RegionPicker"
          value={edited.location?.parent ?? edited.location}
          readOnly={readOnly}
          withNull={false}
          required
          onChange={(location) => onEditedChanged({ ...edited, location })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <PublishedComponent
          region={edited.location?.parent || edited.location}
          value={edited.location?.parent ? edited.location : null}
          pubRef="location.DistrictPicker"
          withNull={false}
          readOnly={readOnly}
          onChange={(location) => onEditedChanged({ ...edited, location: location || edited.location?.parent })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="payer"
          label="email"
          readOnly={readOnly}
          value={edited?.email ?? ""}
          onChange={(email) => onEditedChanged({ ...edited, email })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="payer"
          label="phone"
          readOnly={readOnly}
          value={edited?.phone ?? ""}
          onChange={(phone) => onEditedChanged({ ...edited, phone })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="payer"
          label="fax"
          readOnly={readOnly}
          value={edited?.fax ?? ""}
          onChange={(fax) => onEditedChanged({ ...edited, fax })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="payer"
          required
          label="address"
          multiline
          readOnly={readOnly}
          value={edited?.address ?? ""}
          onChange={(address) => onEditedChanged({ ...edited, address })}
        />
      </Grid>
    </Grid>
  );
};

export default MainPanelForm;
