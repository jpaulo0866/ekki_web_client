import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withRouter } from 'react-router-dom';
import { login, getToken, changePass, logout } from '../../services/auth';
import AlertDialog from '../common/alert';

class ChangeMyPass extends React.Component {
  state = {
    open: true,
    oldPass: '',
    newPass: '',
    confirmNewPass: '',
    alertOpen: false,
    title: '',
    message: ''
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.history.push('/home');
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleAlertClose = () => {
    this.setState({
      alertOpen: false
    });
  };

  openAlertDialog = (title, message) => {
    this.setState({
      alertOpen: true,
      title: title,
      message: message
    });
  };

  changePass = () => {
    if (!this.state.oldPass
      || !this.state.newPass
      || !this.state.confirmNewPass) {
      this.openAlertDialog('Campos não informados', 'Preencha todos os campos do formulário');
      return;
    }

    if (this.state.newPass !== this.state.confirmNewPass ) {
      this.openAlertDialog('Senhas não conferem', 'Confirme corretamente a nova senha');
    } else {
      login(getToken().user.email,this.state.oldPass)
      .then((response) => {
        if (response.data.token) {
          changePass(getToken().user.email, this.state.oldPass, this.state.newPass)
          .then((response) => {
            if (response.data.status) {
              window.alert('Senha alterada com sucesso. Faça o login novamente com a nova senha');
              logout();
            } else {
              this.openAlertDialog('Erro ao Trocar a Senha', response.data.message);
            }
          })
          .catch((err) => this.openAlertDialog('Erro ao Trocar a Senha', err.stack));    
        }
      })
      .catch((err) => this.openAlertDialog('Erro ao realizar o Login', err.stack));
    }
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
        <AlertDialog 
          open={this.state.alertOpen}
          title={this.state.title}
          message={this.state.message}
          onClose={this.handleAlertClose}/>
          <DialogTitle id="form-dialog-title">Alteração de Senha</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="oldpass"
              value={this.state.oldPass}
              onChange={this.handleChange('oldPass')}
              label="Senha Antiga"
              type="password"
              fullWidth
            />
            <TextField
              margin="dense"
              id="newpass"
              value={this.state.newPass}
              onChange={this.handleChange('newPass')}
              label="Nova Senha"
              type="password"
              fullWidth
            />
            <TextField
              margin="dense"
              id="confirmpass"
              value={this.state.confirmNewPass}
              onChange={this.handleChange('confirmNewPass')}
              label="Confirmar Nova Senha"
              type="password"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={this.changePass} color="primary">
              Alterar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withRouter(ChangeMyPass);