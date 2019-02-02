import React from 'react';

import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import { ApiStatus } from '../../models';

const styles = (theme: Theme) => createStyles({});

class Contacts extends React.Component<ContactsProps> {
  componentDidMount() {
    this.props.loadContacts();
  }

  render() {
    const { classes } = this.props;

    return this.props.children;
  }
}

export default withStyles(styles)(Contacts);

export interface IContactStateProps {
  loadingStatus: ApiStatus;
}

export interface IContactDispatchProps {
  loadContacts: () => {};
}

type ContactsProps = IContactStateProps &
  IContactDispatchProps &
  WithStyles<typeof styles>;
