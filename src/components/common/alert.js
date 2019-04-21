import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AlertDialog extends React.Component {

  handleClose = () => {
    this.props.onClose();
  };

  render() {
    const { onClose, title, message, ...other } = this.props;

    return (
      <Dialog
        TransitionComponent={Transition}
        keepMounted
        onClose={this.handleClose}
        {...other}
      >
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Fechar
            </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

AlertDialog.propTypes = {
  onClose: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
};

export default AlertDialog;