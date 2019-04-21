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
import TablePaginationActionsWrapped from '../common/table.pagination.actions';
import Paper from '@material-ui/core/Paper';
import WeekTransfers from './weektransfers';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TransferModal from './transfer_modal';
import api from '../../services/api.interceptor';
import AlertDialog from '../common/alert';
import moment from 'moment';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  card: {
    minWidth: 275,
    margin: '10px'
  }
});

class Transfers extends React.Component {
  state = {
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

  componentDidMount() {
    this.fetchAll();
  }

  fetchAll = () => {
    api.get(`/transfer/${this.state.page + 1}/${this.state.rowsPerPage}`)
      .then((response) => {
        this.setState({
          data: response.data.data.docs,
          totalElements: response.data.data.total
        })
      })
      .catch((err) => {
        this.openAlertDialog('Erro ao Buscar os Tranferências', err.stack);
      })
  }

  handleModalOpen = () => {
    this.setState({ open: true });
  };

  handleModalClose = () => {
    this.setState({ open: false });
  };

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
    this.setState({ selectedId: null }, () => {
      this.setState({ open: true })
    });
  };

  handleModalClose = () => {
    this.setState({ open: false, selectedId: '', page: 0 }, () => {
      this.fetchAll();
    });
  };

  detailTransfer = (e) => {
    this.setState({ selectedId: e.currentTarget.value }, () => {
      this.setState({ open: true })
    });
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
            <Button variant="contained" color="primary" onClick={this.handleModalOpen}>Realizar uma nova Transferência</Button>
            <TransferModal
              open={this.state.open}
              selectedId={this.state.selectedId}
              onClose={this.handleModalClose} />
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h4" gutterBottom component="h2">
              Minhas Transferências
          </Typography>
            <div>
              <Paper className={classes.root}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Data da Transferência</TableCell>
                      <TableCell>Favorecido</TableCell>
                      <TableCell>Identificação</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.data.map(n => (
                      <TableRow key={n._id}>
                        <TableCell>{moment(n.created).format('DD/MM/YYYY hh:mm:ss')}</TableCell>
                        <TableCell>{n.favored.name}</TableCell>
                        <TableCell>{n.identification}</TableCell>
                        <TableCell>{`R$ ${n.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}</TableCell>
                        <TableCell>{n.status}</TableCell>
                        <TableCell>
                          <Button variant="contained" type="button" color="default" value={n._id} onClick={this.detailTransfer}>Detalhes</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
              </Paper>
            </div>
          </CardContent>
        </Card>
        <WeekTransfers />
      </main>
    );
  }
}

Transfers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Transfers);