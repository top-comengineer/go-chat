import classnames from 'classnames';
import React from 'react';

import { Typography } from '@material-ui/core';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import { IMessage } from '../../reducers/contactReducer';

const styles = (theme: Theme) =>
  createStyles({
    messageContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end'
    },
    receivedMessageContainer: {
      justifyContent: 'flex-start'
    },
    message: {
      background:
        theme.palette.type === 'light'
          ? theme.palette.background.paper
          : '#000',
      padding: `${theme.spacing.unit} ${theme.spacing.unit * 2}`,
      marginBottom: theme.spacing.unit * 2,
      borderRadius: 6
    },
    receivedMessage: {
      background: theme.customColors.paperTop
    }
  });

class Message extends React.Component<MessageProps> {
  render() {
    const { classes, message } = this.props;

    return (
      <div
        className={classnames(classes.messageContainer, {
          [classes.receivedMessageContainer]: message.incoming
        })}
      >
        <div
          className={classnames(classes.message, {
            [classes.receivedMessage]: message.incoming
          })}
        >
          <Typography>{message.message}</Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Message);

interface IMessageOwnProps {
  message: IMessage;
}

type MessageProps = IMessageOwnProps & WithStyles<typeof styles>;
