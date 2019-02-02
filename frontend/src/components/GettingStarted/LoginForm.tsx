import React, { useContext, useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import VisibilityOn from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import styles from './formStyles';
import GettingStartedContext from './GettingStartedContext';

function LoginForm(props: LoginFormProps) {
  const { classes } = props;
  const baseUrl = props.match.url.replace('/login', '');

  const ctx = useContext(GettingStartedContext);
  const [showPassword, togglePassword] = useState(false);
  useEffect(() => ctx.reset, [props.match.path]);

  return (
    <div className={classes.wrap}>
      <div className={classes.logo}>
        <Typography variant="h5">Login</Typography>
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
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          label="Password"
          fullWidth
          value={ctx.password}
          onChange={ctx.handleChange('password')}
          onBlur={ctx.handleBlur('password')}
          error={Boolean(ctx.errors.password)}
          helperText={ctx.errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => togglePassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <VisibilityOn />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </div>
      <div className={classes.row}>
        <Typography
          component="a"
          {...{ href: '#' }}
          color="primary"
          className="link"
        >
          Forgot Password?
        </Typography>
      </div>
      <div className={classes.footer}>
        <Typography
          color="primary"
          component={Link as any}
          {...{ to: `${baseUrl}/register` }}
          className="link"
        >
          Create account
        </Typography>
        {ctx.loading ? (
          <CircularProgress />
        ) : (
          <Button variant="contained" color="primary" onClick={ctx.login}>
            Login
          </Button>
        )}
      </div>
    </div>
  );
}

export default withStyles(styles)(withRouter(LoginForm));

type LoginFormProps = WithStyles<typeof styles> & RouteComponentProps<{}>;
