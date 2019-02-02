import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Cancel from '@material-ui/icons/Cancel';
import Done from '@material-ui/icons/Done';
import PersonAdd from '@material-ui/icons/PersonAdd';
import { ISearchResult } from '../../models';
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

class Contact extends React.Component<ResultProps> {
  addToContact = () => {
    this.props.addToContact(this.props.result.id);
  };

  render() {
    const { classes, result } = this.props;

    return (
      <>
        <ListItem button>
          <div className={classes.listItem}>
            <Avatar
              className={classes.avatar}
              src="https://lh3.googleusercontent.com/-AbI1_omUFBM/AAAAAAAAAAI/AAAAAAAAAAA/ACevoQMXMyeBclA8sxM2U1ZRDjmFutRiEg/"
            />
            <div className={classes.userInfo}>
              <Typography variant="body1">{result.name}</Typography>
            </div>
            {!result.inContact && (
              <IconButton onClick={this.addToContact}>
                <PersonAdd />
              </IconButton>
            )}
          </div>
        </ListItem>
        <Divider />
      </>
    );
  }
}

export default withStyles(styles)(Contact);

interface IResultOwnProps {
  result: ISearchResult;
  addToContact: (id: string) => void;
}

type ResultProps = IResultOwnProps & WithStyles<typeof styles>;
