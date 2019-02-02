import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { IContactDetail } from '../../reducers/contactReducer';

const styles = (theme: Theme) =>
  createStyles({
    listItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 1
    },
    avatar: {
      width: 35,
      height: 35
    },
    userInfo: {
      flex: 1,
      padding: 8
    }
  });

class Contact extends React.Component<ContactProps> {
  select = () => {
    this.props.startConversation(this.props.contact.id);
  };

  render() {
    const { classes, contact } = this.props;

    return (
      <>
        <ListItem button onClick={this.select}>
          <div className={classes.listItem}>
            <Avatar
              className={classes.avatar}
              src="https://lh3.googleusercontent.com/-AbI1_omUFBM/AAAAAAAAAAI/AAAAAAAAAAA/ACevoQMXMyeBclA8sxM2U1ZRDjmFutRiEg/"
            />
            <div className={classes.userInfo}>
              <Typography variant="body1">{contact.name}</Typography>
            </div>
          </div>
        </ListItem>
        <Divider />
      </>
    );
  }
}

export default withStyles(styles)(Contact);

interface IContactOwnProps {
  contact: IContactDetail;
  startConversation: (id: string) => void;
}

type ContactProps = IContactOwnProps & WithStyles<typeof styles>;
