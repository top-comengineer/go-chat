import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import Menu from '@material-ui/icons/Menu';
import Dropdown from '../Dropdown/Dropdown';

const styles = (theme: Theme) =>
  createStyles({
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      color: '#fff',
      padding: 0
    },
    logo: {},
    username: {
      marginLeft: 2,
      fontWeight: 'bold',
      fontSize: 14,
      textTransform: 'none',
      letterSpacing: 'normal'
    },
    dropdownCaret: {
      marginLeft: 3
    },
    switch: {
      color: green[600]
    },
    dropdown: {
      '& li': {
        fontSize: 14,
        padding: 10
      }
    },
    logout: {
      color: '#ef5350'
    }
  });

class Header extends React.Component<HeaderProps, IHeaderState> {
  state = {
    opened: false
  };

  open = () => {
    this.setState({
      opened: true
    });
  };

  close = () => {
    this.setState({
      opened: false
    });
  };

  logout = () => {
    this.close();
    this.props.logout();
  };

  dropdownContent() {
    return (
      <MenuList className={this.props.classes.dropdown}>
        <MenuItem onClick={this.props.toggleTheme}>
          <FormControlLabel
            style={{ pointerEvents: 'none', margin: 0 }}
            control={
              <Switch
                checked={this.props.themeType === 'dark'}
                classes={{ root: this.props.classes.switch }}
              />
            }
            label="Dark theme"
            labelPlacement="start"
          />
        </MenuItem>
        <MenuItem onClick={this.logout} className={this.props.classes.logout}>
          Logout
        </MenuItem>
      </MenuList>
    );
  }

  render() {
    const { classes, name, authenticated, toggleSidebar } = this.props;
    const { opened } = this.state;

    return (
      <AppBar color="primary">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h4" color="inherit" className={classes.logo}>
            <IconButton onClick={toggleSidebar} color="inherit">
              <Menu />
            </IconButton>
            GoChat
          </Typography>
          <div>
            {authenticated && (
              <Dropdown
                dropdown={this.dropdownContent()}
                onClose={this.close}
                opened={opened}
                placement="bottom-end"
              >
                <Button onClick={this.open} color="inherit">
                  <AccountCircleOutlinedIcon fontSize="default" />
                  <span className={classes.username}>{name}</span>
                  <ExpandMoreRoundedIcon className={classes.dropdownCaret} />
                </Button>
              </Dropdown>
            )}
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);

interface IHeaderState {
  opened: boolean;
}

export interface IHeaderStateProps {
  authenticated: boolean;
  themeType: string;
  name: string;
}

export interface IHeaderDispatchProps {
  toggleTheme: () => {};
  toggleSidebar: () => {};
  logout: () => {};
}

type HeaderProps = IHeaderStateProps &
  IHeaderDispatchProps &
  WithStyles<typeof styles>;
