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
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import styles from './formStyles';
import GettingStartedContext from './GettingStartedContext';

function RegisterForm(props: RegisterFormProps) {
  const { classes } = props;
  const baseUrl = props.match.url.replace('/register', '');

  const ctx = useContext(GettingStartedContext);
  const [showPassword, togglePassword] = useState(false);
  useEffect(() => ctx.reset, [props.match.path]);

  return (
    <div className={classes.wrap}>
      <div className={classes.logo}>
        <Typography variant="h5">Create account</Typography>
      </div>
      <div className={classes.row}>
        <TextField
          variant="outlined"
          label="Name"
          fullWidth
          autoFocus
          value={ctx.name}
          onBlur={ctx.handleBlur('name')}
          error={Boolean(ctx.errors.name)}
          helperText={ctx.errors.name}
          onChange={ctx.handleChange('name')}
        />
      </div>
      <div className={classes.row}>
        <TextField
          variant="outlined"
          label="Email"
          fullWidth
          value={ctx.email}
          onBlur={ctx.handleBlur('email')}
          error={Boolean(ctx.errors.email)}
          helperText={ctx.errors.email}
          onChange={ctx.handleChange('email')}
        />
      </div>
      <div className={classes.row}>
        <TextField
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          label="Password"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => togglePassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <VisibilityOn />}
                </IconButton>
              </InputAdornment>
            )
          }}
          value={ctx.password}
          onBlur={ctx.handleBlur('password')}
          error={Boolean(ctx.errors.password)}
          helperText={ctx.errors.password}
          onChange={ctx.handleChange('password')}
        />
      </div>
      <div className={classes.footer}>
        <Typography
          color="primary"
          component={Link as any}
          {...{ to: `${baseUrl}/login` }}
          className="link"
        >
          Already a member? Login
        </Typography>
        {ctx.loading ? (
          <CircularProgress />
        ) : (
          <Button variant="contained" color="primary" onClick={ctx.register}>
            Create
          </Button>
        )}
      </div>
    </div>
  );
}

export default withStyles(styles)(withRouter(RegisterForm));

type RegisterFormProps = WithStyles<typeof styles> & RouteComponentProps<{}>;
