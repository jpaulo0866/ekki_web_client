import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AlertDialog from '../common/alert';
import InputMask from 'react-input-mask';
import api from '../../services/api.interceptor';

const styles = theme => ({

});

class CreditCardModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.find = this.find.bind(this);

    this.state = {
      nome: '',
      proprietario: '',
      bandeira: '',
      numero: '',
      vencimento: '',
      cv: ''
    };
  }

  formValid = () => {
    return this.state.nome 
            && this.state.proprietario
            && this.state.bandeira
            && this.state.numero
            && this.state.vencimento
            && this.state.cv;
  }

  save() {
    let creditcard = {
      _id: this.state.id,
      name: this.state.nome,
      owner: this.state.proprietario,
      number: this.state.numero,
      flag: this.state.bandeira,
      validThru: this.state.vencimento,
      cv: this.state.cv,
    };
    if (this.state.id) {
      api.put('/creditcard', creditcard)
        .then((result) => this.handleClose())
        .catch(err => this.openAlertDialog('Erro Ao Salvar os Dados', err.stack));
    } else {
      delete creditcard._id;
      api.post('/creditcard', creditcard)
        .then((result) => this.handleClose())
        .catch(err => this.openAlertDialog('Erro Ao Salvar os Dados', err.stack));
    }
  }

  find = (id) => {
    api.get(`/creditcard/${id}`)
      .then((response) => {
        this.setState({
          id: response.data.data._id,
          nome: response.data.data.name,
          proprietario: response.data.data.owner,
          numero: response.data.data.number,
          bandeira: response.data.data.flag,
          vencimento: response.data.data.validThru,
          cv: response.data.data.cv,
        })
      })
      .catch((err) => this.openAlertDialog('Erro ao Buscar o Objeto', err.stack))
  }

  handleClose = () => {
    this.props.onClose(this.props.selectedId);
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  title() {
    return this.state.id ? 'Editar Cartão' : 'Adicionar novo Cartão';
  }

  componentWillReceiveProps() {
    const { selectedId } = this.props;
    if (selectedId) {
      this.find(selectedId);
    } else {
      this.setState({
        nome: '',
        proprietario: '',
        bandeira: '',
        numero: '',
        vencimento: '',
        cv: ''
      })
    }
  }

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

  render() {
    const { classes, onClose, selectedId, ...other } = this.props;

    return (
      <Dialog onClose={this.handleClose} {...other}>
        <AlertDialog
          open={this.state.alertOpen}
          title={this.state.title}
          message={this.state.message}
          onClose={this.handleAlertClose} />
        <DialogContent>
          <div>
            <Typography variant="h4" component="h3">
              {this.title()}
            </Typography>
            <TextField
              id="input-apelido"
              label="Apelido"
              value={this.state.nome}
              onChange={this.handleChange('nome')}
              margin="normal"
              variant="outlined"
              style={{ width: '100%' }}
            />
            <TextField
              id="input-proprietario"
              label="Nome no Cartão"
              value={this.state.proprietario}
              onChange={this.handleChange('proprietario')}
              margin="normal"
              variant="outlined"
              style={{ width: '100%' }}
            />
            <TextField
              id="input-bandeira"
              label="Bandeira"
              value={this.state.bandeira}
              onChange={this.handleChange('bandeira')}
              margin="normal"
              variant="outlined"
              style={{ width: '100%' }}
            />
            <InputMask mask="9999.9999.9999.9999"
              value={this.state.numero}
              onChange={this.handleChange('numero')} maskChar=" ">
              {() =>
                <TextField
                  id="input-numero"
                  label="Número do Cartão"
                  margin="normal"
                  variant="outlined"
                  style={{ width: '100%' }} />
              }
            </InputMask>
            <InputMask mask="99/99"
              value={this.state.vencimento}
              onChange={this.handleChange('vencimento')} maskChar=" ">
              {() =>
                <TextField
                  id="input-vencimento"
                  label="Vencimento do Cartão"
                  margin="normal"
                  variant="outlined"
                  style={{ width: '100%' }}
                />}
            </InputMask>
            <InputMask mask="999"
              value={this.state.cv}
              onChange={this.handleChange('cv')} maskChar=" ">
              {() =>
                <TextField
                  id="input-cv"
                  label="Número do CV"
                  margin="normal"
                  variant="outlined"
                  style={{ width: '100%' }}
                />}
            </InputMask>
            
            <Button disabled={!this.formValid()} variant="contained" type="button" color="primary" onClick={this.save}>Salvar</Button>
            <Button variant="contained" type="button" color="default" onClick={this.handleClose}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

CreditCardModal.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedId: PropTypes.string,
};

export default withStyles(styles)(CreditCardModal);