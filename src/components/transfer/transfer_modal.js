import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import ContactModal from '../contacts/contact_modal';
import AlertDialog from '../common/alert';
import CreditcardModal from '../creditcard/creditcard_modal';
import api from '../../services/api.interceptor';
import { login, getToken, setToken, logout } from '../../services/auth';

const styles = theme => ({
  formControl: {
    margin: '10px',
    width: '98%'
  },
});

class SelectCreditCardDialog extends React.Component {
  state = {
    openCreditDialog: false,
    creditCards: []
  }

  componentDidMount() {
    this.findAllCards();
  }

  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  findAllCards = () => {
    api.get(`/creditcard/1/100`)
      .then((response) => {
        this.setState({
          creditCards: response.data.data.docs
        })
      })
  }

  addCreditCard = () => {
    this.setState({ openCreditDialog: true });
  }

  handleModalClose = () => {
    this.setState({ openCreditDialog: false }, () => {
      this.findAllCards();
    })
  }

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog onClose={this.handleClose} {...other}>
        <CreditcardModal
          open={this.state.openCreditDialog}
          onClose={this.handleModalClose} />
        <DialogTitle id="simple-dialog-title">Selecione um Cartao de Crédito</DialogTitle>
        <div>
          <List>
            {this.state.creditCards.map(card => (
              <ListItem button onClick={() => this.handleListItemClick(card)} key={card._id}>
                <ListItemText primary={card.name} />
              </ListItem>
            ))}
            <ListItem button onClick={() => this.addCreditCard()}>
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Cadastrar Cartão de Crédito" />
            </ListItem>
          </List>
        </div>
      </Dialog>
    );
  }
}

SelectCreditCardDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

const SelectCreditCardDialogWrap = withStyles(styles)(SelectCreditCardDialog);

class TransferModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.openContactModal = this.openContactModal.bind(this);
    this.closeContactModal = this.closeContactModal.bind(this);

    this.state = {
      id: '',
      contatos: [],
      contato: null,
      valor: null,
      identificacao: '',
      valorEmCredito: 0,
      cartaoCreditoUtilizado: null,
      openDialog: false,
      openSelectCardDialog: false,
      alertOpen: false,
      title: '',
      message: '',
      tentativas: 0
    };
  }
  
  formValid = () => {
    return !this.state.id && this.state.contato 
            && this.state.valor
            && this.state.identificacao;
  }

  validaValorTransacao = (callback) => {
    if (this.state.valor > 1000) {
      let inputed = window.prompt('Para transações maiores que R$1000,00 é necessário confirmar a senha.');
      let email = getToken().user.email;
      login(email, inputed)
        .then((response) => {
          if (response.data.token) {
            setToken(response.data);
            callback();
          }
        })
        .catch((err) => {
          this.openAlertDialog('Falha no Login', 'Senha inválida');
          this.setState({ tentativas: this.state.tentativas + 1 })
          if (this.state.tentativas > 3) {
            window.alert('Realize o login novamente, Número de tentativas de login ultrapassadas.');
            logout();
          }
        })
    } else {
      callback()
    }
  }

  save() {
    if (!this.state.id) {
      this.validaValorTransacao(() => {
        api.get('/transaction/mybalance')
          .then((result) => {
            if (this.state.valor > result.data.data.value) {
              if (window.confirm(`O valor da Transferência é maior que o saldo atual. 
            Será utilizado um cartão de crédito para a operação. 
            Deseja continuar?`)) {
                this.setState({ valorEmCredito: result.data.data.value }, () => {
                  this.openCreditCardModal();
                });
              } else {
                window.alert('Operação Cancelada');
              }
            } else {
              let transfer = {
                favored: this.state.contato.user,
                value: this.state.valor,
                identification: this.state.identificacao,
                valueOnCredit: 0,
                creditCardUsed: null
              };
              api.post('/transfer', transfer)
                .then((result) => this.handleClose())
                .catch(err => this.openAlertDialog('Erro Ao Salvar os Dados', err.stack));
            }
          })
          .catch(err => this.openAlertDialog('Erro Ao Buscar o Saldo Atual', err.stack));
      })
    }
  }

  find = (id) => {
    api.get(`/transfer/${id}`)
      .then((response) => {
        let contact = this.state.contatos.filter((item) => item.user === response.data.data.favored._id);
        contact = contact ? contact[0] : null;
        this.setState({
          id: response.data.data._id,
          contato: contact,
          valor: response.data.data.value,
          identificacao: response.data.data.identification,
        })
      })
      .catch((err) => this.openAlertDialog('Erro ao Buscar o Objeto', err.stack))
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

  componentWillReceiveProps() {
    this.findAllContacts();
    const { selectedId } = this.props;
    if (selectedId) {
      this.find(selectedId);
      this.setState({
        openDialog: false,
        openSelectCardDialog: false,
        alertOpen: false,
        title: '',
        message: '',
        tentativas: 0
      })
    } else {
      this.setState({
        id: '',
        contato: null,
        valor: null,
        identificacao: '',
        valorEmCredito: 0,
        cartaoCreditoUtilizado: null,
        openDialog: false,
        openSelectCardDialog: false,
        alertOpen: false,
        title: '',
        message: '',
        tentativas: 0
      })
    }
  }
  openContactModal() {
    this.setState({
      openDialog: true
    });
  }

  closeContactModal() {
    this.setState({
      openDialog: false
    }, () => this.findAllContacts());
  }

  findAllContacts = () => {
    api.get(`/contact/1/100`)
      .then((result) => {
        this.setState({
          contatos: result.data.data.docs
        })
      })
      .catch((err) => this.openAlertDialog('Erro ao Buscar os Contatos', err.stack));
  }

  handleClose = () => {
    this.props.onClose();
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleChangeContato = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  openCreditCardModal() {
    this.setState({
      cartaoCreditoUtilizado: null,
      openSelectCardDialog: true
    });
  }

  handleCreditCardClose = (value) => {
    this.setState({ cartaoCreditoUtilizado: value, openSelectCardDialog: false }, () => {
      if (this.state.cartaoCreditoUtilizado) {
        let transfer = {
          favored: this.state.contato.user,
          value: this.state.valor,
          identification: this.state.identificacao,
          valueOnCredit: this.state.valor - this.state.valorEmCredito,
          creditCardUsed: this.state.cartaoCreditoUtilizado
        };
        api.post('/transfer', transfer)
          .then((result) => this.handleClose())
          .catch(err => this.openAlertDialog('Erro Ao Salvar os Dados', err.stack));
      } else {
        window.alert('Cartão de Crédito Não foi Selecionado. Operação Cancelada!');
      }
    });

  }

  title() {
    return this.state.id ? 'Detalhes da Transferência' : 'Nova Transferência';
  }

  render() {
    const { classes, onClose, ...other } = this.props;

    return (
      <Dialog onClose={this.handleClose} {...other}>
        <AlertDialog
          open={this.state.alertOpen}
          title={this.state.title}
          message={this.state.message}
          onClose={this.handleAlertClose}
        />
        <SelectCreditCardDialogWrap
          selectedValue={this.state.cartaoCreditoUtilizado}
          open={this.state.openSelectCardDialog}
          onClose={this.handleCreditCardClose}
        />
        <DialogContent>
          <div>
            <Typography variant="h4" component="h3">
              {this.title()}
            </Typography>
            <FormControl  className={classes.formControl}>
              <InputLabel shrink={this.state.contato} htmlFor="select-contato">Favorecido(a)</InputLabel>
              <Select
                disabled={this.state.id}
                value={this.state.contato}
                onChange={this.handleChangeContato}
                inputProps={{
                  name: 'contato',
                  id: 'select-contato',
                }}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {this.state.contatos.map((item) => (
                  <MenuItem value={item}>{item.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button disabled={this.state.id} type="button" variant="text" color="accent" onClick={this.openContactModal}>
              Adicionar Novo Favorecido</Button>
            <ContactModal
              open={this.state.openDialog}
              onClose={this.closeContactModal} />
            <TextField
              id="input-valor"
              label="Valor"
              disabled={this.state.id}
              value={this.state.valor}
              onChange={this.handleChange('valor')}
              margin="normal"
              InputLabelProps={{
                shrink: this.state.valor != null,
              }}
              type="number"
              variant="outlined"
              style={{ width: '100%' }}
            />
            <TextField
              id="input-identificap"
              disabled={this.state.id}
              label="Identificação"
              value={this.state.identificacao}
              onChange={this.handleChange('identificacao')}
              margin="normal"
              variant="outlined"
              style={{ width: '100%' }}
            />

            <Button disabled={!this.formValid()} variant="contained" type="button" color="primary" onClick={this.save}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

TransferModal.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func
};

export default withStyles(styles)(TransferModal);