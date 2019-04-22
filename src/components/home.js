import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CardContent from '@material-ui/core/CardContent';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import WeekTransfers from './transfer/weektransfers';
import { getToken } from '../services/auth';
import api from '../services/api.interceptor';
import moment from 'moment';

const styles = theme => ({
  card: {
    minWidth: 275,
    margin: '10px'
  },
  title: {
    fontSize: 14,
  }
});

class Home extends React.Component {
  state = {
    open: true,
    accountBalance: null
  };

  componentDidMount() {
    api.get('/transaction/mybalance')
      .then((result) => {
        this.setState({ accountBalance: result.data.data })
      })
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  getUserName() {
    let token = getToken();
    return token.user.name;
  }

  render() {
    const { classes } = this.props;

    return (
      <main>
        <div>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" component="h1">
                {`Seja Bem Vindo(a) ${this.getUserName()}`}
              </Typography>
            </CardContent>
          </Card>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Saldo Atual
              </Typography>
              <Typography variant="h5" component="h1" style={{color: 'green'}}>
                {`R$ ${this.state.accountBalance ? this.state.accountBalance.value.toLocaleString(undefined, { minimumFractionDigits: 2 }) : 0}`}
              </Typography>
            </CardContent>
          </Card>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Extrato dos Últimos 7 Dias
              </Typography>
              <List>
                {this.state.accountBalance ? this.state.accountBalance.history.map(n => (
                  <ListItem>
                    {n.type === 'In' ? (
                      <ListItemIcon>
                        <AddIcon color="primary"></AddIcon>
                      </ListItemIcon>) :
                      (
                        <ListItemIcon>
                          <RemoveIcon color="secondary" />
                        </ListItemIcon>
                      )}
                    <ListItemText primary={n.type === 'In' ? `De: ${n.from.name}` : `Para: ${n.to.name}`} />
                    <ListItemText primary={`Data: ${moment(n.created).format('DD/MM/YYYY hh:mm:ss')}`} />
                    <ListItemText primary={`Valor: R$ ${n.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                    <ListItemText primary={`Identificação: ${n.identification}`} />
                  </ListItem>
                )) : null}
              </List>
            </CardContent>
          </Card>
        </div>

        <div>
          <WeekTransfers />
        </div>
      </main>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);