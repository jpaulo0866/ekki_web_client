import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CreditcardModal from './creditcard_modal';
import AlertDialog from '../common/alert';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Grow from '@material-ui/core/Grow';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TablePaginationActionsWrapped from '../common/table.pagination.actions';
import api from '../../services/api.interceptor';

const styles = theme => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 275,
  },
  tableCell: {
    paddingRight: 3,
    paddingLeft: 4
  },
  card: {
    minWidth: 275,
    margin: '10px'
  }
});

class CreditCard extends React.Component {
  constructor(props) {
    super(props);
    this.fetchAll = this.fetchAll.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.openAlertDialog = this.openAlertDialog.bind(this);
    this.editCreditCard = this.editCreditCard.bind(this);
    this.removeCreditCard = this.removeCreditCard.bind(this);

    this.state = {
      open: false,
      selectedId: '',
      page: 0,
      rowsPerPage: 5,
      totalElements: 0,
      data: [],
      alertOpen: false,
      title: '',
      message: ''
    }; 
  }

  componentDidMount() {
    this.fetchAll();
  }

  fetchAll = () => {
    api.get(`/creditcard/${this.state.page+1}/${this.state.rowsPerPage}`)
    .then((response) => {
      this.setState({
        data: response.data.data.docs,
        totalElements: response.data.data.total
      })
    })
    .catch((err) => {
      this.openAlertDialog('Erro ao Buscar os Cartões de Crédito', err.stack);
    })
  }

  handleChangePage = (event, page) => {
    this.setState({ page }, () => {
      this.fetchAll();
    });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value }, () => {
      this.fetchAll();
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

  handleModalOpen = () => {
    this.setState({  selectedId: null }, () => {
      this.setState({ open: true })
    });
  };

  handleModalClose = () => {
    this.setState({ open: false, selectedId: '', page: 0 }, () => {
      this.fetchAll();
    });
  };

  editCreditCard = (e) => {
    this.setState({ selectedId: e.currentTarget.value }, () => {
      this.setState({ open: true })
    });
  }

  removeCreditCard = (e) => {
    if (window.confirm('Esta operação é irreversível, deseja continuar?')) {
      api.delete(`/creditcard/${e.currentTarget.value}`)
      .then((result) => this.fetchAll())
      .catch((err) => this.openAlertDialog('Erro ao Confirmar a operação', err.stack));
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <main>
        <AlertDialog open={this.state.alertOpen}
              title={this.state.title}
              message={this.state.message}
              onClose={this.handleAlertClose} />

          <Card className={classes.card}>
            <CardContent>
          <Typography variant="h4" gutterBottom component="h2">
            Meus Cartões
          </Typography>
          <Avatar>
            <Tooltip title="Adicionar Cartão" TransitionComponent={Grow}>
              <IconButton color="inherit" onClick={this.handleModalOpen}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Avatar>
              <CreditcardModal 
              open={this.state.open}
              selectedId={this.state.selectedId}
              onClose={this.handleModalClose} />
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableCell}>Apelido</TableCell>
                        <TableCell className={classes.tableCell}>Número</TableCell>
                        <TableCell className={classes.tableCell}>Proprietário</TableCell>
                        <TableCell className={classes.tableCell}>Validade</TableCell>
                        <TableCell className={classes.tableCell}>Ações</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.data.map(n => (
                        <TableRow key={n._id}>
                        <TableCell className={classes.tableCell}>{n.name}</TableCell>
                        <TableCell className={classes.tableCell}>{n.number}</TableCell>
                        <TableCell className={classes.tableCell}>{n.owner}</TableCell>
                        <TableCell className={classes.tableCell}>{n.validThru}</TableCell>
                        <TableCell className={classes.tableCell}>
                          <div style={{display: 'flex'}}>
                            <Avatar style={{margin: '2px'}}>
                              <Tooltip title="Editar" TransitionComponent={Grow}>
                                <IconButton color="inherit" value={n._id} onClick={this.editCreditCard}>
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </Avatar>
                            <Avatar style={{margin: '2px'}}>
                              <Tooltip title="Excluir" placement="bottom" TransitionComponent={Grow}>
                                <IconButton color="inherit" value={n._id} onClick={this.removeCreditCard}>
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Avatar>
                          </div>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25]}
                          colSpan={5}
                          count={this.state.totalElements}
                          rowsPerPage={this.state.rowsPerPage}
                          page={this.state.page}
                          onChangePage={this.handleChangePage}
                          onChangeRowsPerPage={this.handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActionsWrapped}
                        />
                      </TableRow>
                    </TableFooter>
                </Table>
            </Paper>
          </CardContent>
          </Card>
      </main>
    );
  }
}

CreditCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreditCard);