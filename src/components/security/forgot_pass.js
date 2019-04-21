import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { changePass, logout } from '../../services/auth';
import AlertDialog from '../common/alert';
import Zoom from '@material-ui/core/Zoom';
import api from '../../services/api.interceptor';

function Transition(props) {
    return <Zoom direction="up" {...props} />;
}
class ForgotMyPass extends React.Component {
  state = {
    email: '',
    newPass: '',
    tokenSended: false,
    token: '',
    alertOpen: false,
    title: '',
    message: ''
  };

  handleClose = () => {
    this.props.onClose();
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

  requestToken = () => {
    api.post('/user/forgotpassword', {email: this.state.email})
    .then((response) => {
        if (response.data.status) {
            this.setState({tokenSended: true});
            this.openAlertDialog('Token enviado', 'Cheque sua caixa de email');
        } else {
            this.openAlertDialog('Erro ao Solicitar o Token', response.data.message);
        }
    })
    .catch((err) => {
        this.openAlertDialog('Erro ao Solicitar o Token', err.stack);
    })
  }

  changePass = () => {
    if (!this.state.email
        || !this.state.token
      || !this.state.newPass) {
      this.openAlertDialog('Campos não informados', 'Preencha todos os campos do formulário');
      return;
    }

    changePass(this.state.email, null, this.state.newPass, this.state.token)
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

  render() {
    const { onClose, ...other } = this.props;

    return (
        
      <div>
        <Dialog
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          {...other}
        >
        <AlertDialog 
          open={this.state.alertOpen}
          title={this.state.title}
          message={this.state.message}
          onClose={this.handleAlertClose}/>
          <DialogTitle id="form-dialog-title">Recuperação de Senha</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="emailRecover"
              value={this.state.email}
              onChange={this.handleChange('email')}
              label="Email"
              type="text"
              fullWidth
            />
            <Button onClick={this.requestToken} color="primary">
              Solicitar Token por Email
            </Button>

            <TextField
              margin="dense"
              id="newpass"
              disabled={!this.state.tokenSended}
              value={this.state.token}
              onChange={this.handleChange('token')}
              label="Token"
              type="text"
              fullWidth
            />
            <TextField
              margin="dense"
              id="confirmpass"
              disabled={!this.state.token}
              value={this.state.newPass}
              onChange={this.handleChange('newPass')}
              label="Nova Senha"
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

export default ForgotMyPass;