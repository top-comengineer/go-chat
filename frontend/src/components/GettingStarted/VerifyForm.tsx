import React, { useContext, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import styles from './formStyles';
import GettingStartedContext from './GettingStartedContext';

function VerifyForm(props: VerifyFormProps) {
  const { classes } = props;
  const baseUrl = props.match.url.replace('/verify', '');

  const ctx = useContext(GettingStartedContext);
  useEffect(() => ctx.reset, [props.match.path]);

  return (
    <div className={classes.wrap}>
      <div className={classes.logo}>
        <Typography variant="h5">Verify your account</Typography>
      </div>
      <div className={classes.row}>
        <TextField
          variant="outlined"
          label="Email"
          fullWidth
          autoFocus
          value={ctx.email}
          onChange={ctx.handleChange('email')}
          onBlur={ctx.handleBlur('email')}
          error={Boolean(ctx.errors.email)}
          helperText={ctx.errors.email}
        />
      </div>
      <div className={classes.row}>
        <TextField
          variant="outlined"
          label="Verification Code"
          fullWidth
          value={ctx.code}
          onChange={ctx.handleChange('code')}
          onBlur={ctx.handleBlur('code')}
          error={Boolean(ctx.errors.code)}
          helperText={ctx.errors.code}
        />
      </div>
      <div className={classes.row}>
        <Typography
          component="a"
          {...{ href: '#' }}
          color="primary"
          className="link"
        >
          Resend verification code
        </Typography>
      </div>
      <div className={classes.footer}>
        <Typography
          color="primary"
          component={Link as any}
          {...{ to: `${baseUrl}/login` }}
          className="link"
        >
          Login
        </Typography>
        {ctx.loading ? (
          <CircularProgress />
        ) : (
          <Button variant="contained" color="primary" onClick={ctx.verify}>
            Verify
          </Button>
        )}
      </div>
    </div>
  );
}

export default withStyles(styles)(withRouter(VerifyForm));

type VerifyFormProps = WithStyles<typeof styles> & RouteComponentProps<{}>;
