import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer';
import LineChart from 'recharts/lib/chart/LineChart';
import Line from 'recharts/lib/cartesian/Line';
import XAxis from 'recharts/lib/cartesian/XAxis';
import YAxis from 'recharts/lib/cartesian/YAxis';
import CartesianGrid from 'recharts/lib/cartesian/CartesianGrid';
import Tooltip from 'recharts/lib/component/Tooltip';
import Legend from 'recharts/lib/component/Legend';
import moment from 'moment';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import api from '../../services/api.interceptor';


const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  card: {
    minWidth: 275,
    margin: '10px'
  }
});

class WeekTransfers extends React.Component {
  state = {
    data: [],
  };

  componentDidMount() {
    api.get('/transfer/find/weekly/transfers')
    .then((result) => {
      let resultArray = result.data.data;
      resultArray.forEach((item) => {
        item.created = this.formatDate(item.created);
      })
      this.setState({data: resultArray});
    });
  }

  formatDate = (item) => {
    return moment(item).format('DD/MM/YYYY hh:mm:ss');
  }

  render() {
    const { classes } = this.props;
    
    return (
      <main>
        <Card className={classes.card}>
            <CardContent>
          <Typography variant="h4" gutterBottom component="h2">
            Transferências na Semana
          </Typography>
          <ResponsiveContainer width="99%" height={320}>
            <LineChart data={this.state.data}>
                <XAxis dataKey="created" />
                <YAxis />
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="favored.name" name="Favorecido" stroke="#88aa11" />
                <Line type="monotone" dataKey="identification" name="Identificação" stroke="#44aa33" />
                <Line type="monotone" dataKey="value" name="Valor" stroke="#7744aa"  activeDot={{ r: 8 }} />
            </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    );
  }
}

WeekTransfers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WeekTransfers);