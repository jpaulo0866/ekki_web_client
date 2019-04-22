import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AlertDialog from '../common/alert';
import api from '../../services/api.interceptor';

const styles = theme => ({
});

class ContactModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.find = this.find.bind(this);

    this.state = {
      open: true,
      id: '',
      nome: '',
      email: '',
      banco: '',
      agencia: '',
      conta: '',
      alertOpen: false,
      title: '',
      message: ''
    };
  }

  formValid = () => {
    return this.state.nome 
            && this.state.email
            && this.state.banco
            && this.state.agencia
            && this.state.conta;
  }

  save() {
    let contact = {
      _id: this.state.id,
      name: this.state.nome,
      bank: this.state.banco,
      email: this.state.email,
      agency: this.state.agencia,
      account: this.state.conta,
    };
    if (this.state.id) {
      api.put('/contact', contact)
        .then((result) => this.handleClose())
        .catch(err => this.openAlertDialog('Erro Ao Salvar os Dados', err.stack));
    } else {
      delete contact._id;
      api.post('/contact', contact)
        .then((result) => this.handleClose())
        .catch(err => this.openAlertDialog('Erro Ao Salvar os Dados', err.stack));
    }
  }

  find = (id) => {
    api.get(`/contact/${id}`)
      .then((response) => {
        this.setState({
          id: response.data.data._id,
          nome: response.data.data.name,
          banco: response.data.data.bank,
          email: response.data.data.email,
          agencia: response.data.data.agency,
          conta: response.data.data.account
        })
      })
      .catch((err) => this.openAlertDialog('Erro ao Buscar o Objeto', err.stack))
  }

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
    })
  }

  openAlertDialog = (title, message) => {
    this.setState({
      alertOpen: true,
      title: title,
      message: message
    })
  }

  title() {
    return this.state.id ? 'Editar Contato/Favorecido' : 'Adicionar novo Contato/Favorecido';
  }

  componentWillReceiveProps() {
    const { selectedId } = this.props;
    if (selectedId) {
      this.find(selectedId);
    } else {
      this.setState({
        open: true,
        id: '',
        nome: '',
        banco: '',
        email: '',
        agencia: '',
        conta: '',
        alertOpen: false,
        title: '',
        message: ''
      })
    }
  }

  render() {
    const { classes, onClose, selectedId, ...other } = this.props;

    return (
      <Dialog onClose={this.handleClose} {...other}>
        <DialogContent>
          <AlertDialog
            open={this.state.alertOpen}
            title={this.state.title}
            message={this.state.message}
            onClose={this.handleAlertClose}
          />
          <div>
            <Typography variant="h4" component="h5">
              {this.title()}
            </Typography>
            <TextField
              id="input-nome"
              label="Nome"
              value={this.state.nome}
              onChange={this.handleChange('nome')}
              margin="normal"
              variant="outlined"
              style={{ width: '100%' }}
            />
            <TextField
              id="input-email"
              label="Email"
              value={this.state.email}
              onChange={this.handleChange('email')}
              margin="normal"
              variant="outlined"
              style={{ width: '100%' }}
            />
            <TextField
              id="input-banco"
              label="Banco"
              value={this.state.banco}
              onChange={this.handleChange('banco')}
              margin="normal"
              variant="outlined"
              style={{ width: '100%' }}
            />
            <TextField
              id="input-agencia"
              label="Agencia"
              value={this.state.agencia}
              onChange={this.handleChange('agencia')}
              margin="normal"
              variant="outlined"
              style={{ width: '100%' }}
            />
            <TextField
              id="input-conta"
              label="Conta"
              value={this.state.conta}
              onChange={this.handleChange('conta')}
              margin="normal"
              variant="outlined"
              style={{ width: '100%' }}
            />
            
            <Button disabled={!this.formValid()} variant="contained" type="button" color="primary" onClick={this.save}>Salvar</Button>
            <Button variant="contained" type="button" color="default" onClick={this.handleClose}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

ContactModal.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedId: PropTypes.string,
};

export default withStyles(styles)(ContactModal);