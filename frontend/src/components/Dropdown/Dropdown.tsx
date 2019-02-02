import React from 'react';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper, { PopperPlacementType } from '@material-ui/core/Popper';

class Dropdown extends React.Component<IProps> {
  anchorEl: any;

  render() {
    return (
      <div style={{ position: 'relative' as 'relative' }}>
        <div ref={elem => (this.anchorEl = elem)}>{this.props.children}</div>
        <Popper
          open={this.props.opened}
          anchorEl={this.anchorEl}
          transition={true}
          disablePortal={true}
          style={{ minWidth: '100%' }}
          placement={
            this.props.placement ? this.props.placement : 'bottom-start'
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <Paper square>
                <ClickAwayListener onClickAway={this.props.onClose}>
                  {this.props.dropdown}
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
}

export interface IProps {
  children: React.ReactNode;
  placement?: PopperPlacementType;
  opened: boolean;
  onClose: () => void;
  dropdown: React.ReactNode;
}

export default Dropdown;
