import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import _debounce from "lodash/debounce";
import _ from "lodash";
import { fetchPayers } from "../actions";
import { formatMessage, AutoSuggestion, ProgressOrError, withModulesManager } from "@openimis/fe-core";

const styles = theme => ({
    label: {
        color: theme.palette.primary.main
    }
});

class PayerPicker extends Component {
    constructor(props) {
        super(props);
        this.selectThreshold = props.modulesManager.getConf("fe-payer", "PayerPicker.selectThreshold", 10);
    }

    formatSuggestion = p => !p ? "" : `${p.name || ""}`;

    onSuggestionSelected = v => this.props.onChange(v, this.formatSuggestion(v));

    getSuggestions = (str) => !!str &&
        str.length >= this.props.modulesManager.getConf("fe-payer", "payersMinCharLookup", 2) &&
        this.props.fetchPayers(
            this.props.modulesManager,
            this.props.userHealthFacilityFullPath,
            str,
            this.props.fetchedPayers
        )

    debouncedGetSuggestion = _.debounce(
        this.getSuggestions,
        this.props.modulesManager.getConf("fe-payer", "debounceTime", 800)
    )

    render() {
        const {
            intl, value,
            reset, readOnly = false, required = false,
            payers, fetchingPayers, errorPayers,
            withNull = false, nullLabel = null,
            withLabel = true, label,
        } = this.props;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingPayers} error={errorPayers} />
                {!fetchingPayers && !errorPayers && (
                    <AutoSuggestion
                        module="payer"
                        items={payers}
                        label={!!withLabel && (label || formatMessage(intl, "payer", "PayerPicker.label"))}
                        getSuggestions={this.debouncedGetSuggestion}
                        renderSuggestion={a => <span>{this.formatSuggestion(a)}</span>}
                        getSuggestionValue={this.formatSuggestion}
                        onSuggestionSelected={this.onSuggestionSelected}
                        value={value}
                        reset={reset}
                        readOnly={readOnly}
                        required={required}
                        selectThreshold={this.selectThreshold}
                        withNull={withNull}
                        nullLabel={nullLabel || formatMessage(intl, "payer", "payer.PayerPicker.null")}
                    />
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    userHealthFacilityFullPath: !!state.loc ? state.loc.userHealthFacilityFullPath : null,
    payers: state.payer.payers,
    fetchedPayers: state.payer.fetchedPayers,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPayers }, dispatch);
};

export default withModulesManager(
    connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(PayerPicker))))
);
