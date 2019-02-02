import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import SearchIcon from '@material-ui/icons/Search';
import { ApiStatus, ISearchResult } from '../../models';
import { IContactDetail } from '../../reducers/contactReducer';
import Contact from './Contact';
import Result from './Result';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      //   paddingTop: 64,
      width: 350,
      display: 'flex'
    },
    searchContainer: {
      width: '100%',
      padding: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit
    },
    searchInput: {},
    conversationList: {
      overflow: 'auto'
    }
  });

class Sidebar extends React.Component<SidebarProps, ISidebarState> {
  state = {
    query: ''
  };

  onSearch = e => {
    this.setState(
      {
        query: e.target.value.toLowerCase()
      },
      () => {
        if (this.isValidEmail(this.state.query)) {
          this.props.findUser(this.state.query);
        }
      }
    );
  };

  /* tslint:disable */
  isValidEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  /* tslint:enable */

  startConversation = (id: string) => {
    this.props.toggleSidebar();
    this.props.startConversation(id);
  };

  addToContact = (id: string) => {
    this.setState({
      query: ''
    });
    this.props.addToContact(id);
  };

  render() {
    const {
      classes,
      contacts,
      startConversation,
      open,
      toggleSidebar,
      searchResults,
      searchStatus,
      addToContact
    } = this.props;

    return (
      <SwipeableDrawer
        variant="temporary"
        classes={{ paper: classes.root }}
        open={open}
        onClose={toggleSidebar}
        onOpen={toggleSidebar}
      >
        <div className={classes.searchContainer}>
          <Input
            fullWidth
            disableUnderline
            placeholder="Search contacts"
            className={classes.searchInput}
            onChange={this.onSearch}
            value={this.state.query}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
          />
        </div>
        <Divider />
        {(searchStatus === ApiStatus.IN_PROGRESS ||
          searchResults.length > 0) && (
          <List
            disablePadding
            className={classes.conversationList}
            subheader={
              <ListSubheader component="div">Search Results</ListSubheader>
            }
          >
            {searchStatus === ApiStatus.IN_PROGRESS && <CircularProgress />}
            {searchResults.map(r => (
              <Result key={r.id} result={r} addToContact={this.addToContact} />
            ))}
          </List>
        )}
        <List
          disablePadding
          className={classes.conversationList}
          subheader={<ListSubheader component="div">Contacts</ListSubheader>}
        >
          {contacts
            .filter(c => c.name.toLowerCase().startsWith(this.state.query))
            .map(c => (
              <Contact
                key={c.id}
                contact={c}
                startConversation={this.startConversation}
              />
            ))}
        </List>
      </SwipeableDrawer>
    );
  }
}

export default withStyles(styles)(Sidebar);

export interface ISidebarStateProps {
  contacts: IContactDetail[];
  open: boolean;
  searchStatus: ApiStatus;
  searchResults: ISearchResult[];
}

export interface ISidebarDispatchProps {
  startConversation: (id: string) => {};
  toggleSidebar: () => {};
  findUser: (email: string) => {};
  addToContact: (id: string) => {};
}

interface ISidebarState {
  query: string;
}

type SidebarProps = ISidebarStateProps &
  ISidebarDispatchProps &
  WithStyles<typeof styles>;
