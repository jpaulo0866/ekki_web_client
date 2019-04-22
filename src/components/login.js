
import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockRounded from '@material-ui/icons/LockRounded';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { login, setToken } from '../services/auth';
import AlertDialog from './common/alert';
import ForgotPass from './security/forgot_pass';

const styles = theme => ({
  main: {
    width: '80%',
    display: 'block',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: '50%',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    [theme.breakpoints.up(800 + theme.spacing.unit * 3 * 2)]: {
      width: '20%',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
  },
  paper: {
    marginTop: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.openErrorDialog = this.openErrorDialog.bind(this);
    this.doLogin = this.doLogin.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      email: "",
      password: "",
      openDialog: false,
      title: '',
      message: '',
      forgotDialog: false
    };
  }

  errorTitle = 'Erro no Login';

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleModalClose = () => {
    this.setState({ openDialog: false });
  };

  openErrorDialog(title, message) {
    this.setState({
      openDialog: true,
      title: title,
      message: message
    })
  };

  doLogin() {
    login(this.state.email, this.state.password)
      .then((response) => {
        if (response.data.token) {
          setToken(response.data);
          window.location.replace('/home');
        } else {
          this.openErrorDialog(this.errorTitle, response.data.err);
        }
      })
      .catch((err) => {
        this.openErrorDialog(this.errorTitle, err.response ? err.response.data.err : err.stack);
      })
  };

  handleSubmit = event => {
    event.preventDefault();
    this.doLogin();
  };

  handleForgotPassDialog = () => {
    this.setState({ forgotDialog: false });
  }

  forgotPassword = () => {
    this.setState({ forgotDialog: true });
  }

  render() {
    return (
      <main className={this.props.classes.main}>
        <CssBaseline />
        <AlertDialog open={this.state.openDialog}
          title={this.state.title}
          message={this.state.message}
          onClose={this.handleModalClose} />

        <ForgotPass open={this.state.forgotDialog}
          onClose={this.handleForgotPassDialog} />
        <Paper className={this.props.classes.paper}>
          <Avatar className={this.props.classes.avatar}>
            <LockRounded />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
            </Typography>
          <form className={this.props.classes.form} onSubmit={this.handleSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Endereço de Email</InputLabel>
              <Input id="email" name="email" type="email" value={this.state.email}
                onChange={this.handleChange} autoComplete="email" autoFocus />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Senha</InputLabel>
              <Input name="password" type="password" id="password" value={this.state.password}
                onChange={this.handleChange} autoComplete="current-password" />
            </FormControl>
            <Button type="button" fullWidth onClick={this.forgotPassword}
              variant="text"
              color="default">Esqueceu sua senha?</Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={!(this.state.email.length > 0 && this.state.password.length > 0)}
              className={this.props.classes.submit}>
              Enviar
              </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);