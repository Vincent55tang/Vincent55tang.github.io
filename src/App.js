import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress'
import {cyan50} from 'material-ui/styles/colors';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var Transaction = require('./Transaction.js');
// Required for tap event
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 100,
    backgroundColor: cyan50,
    flex: 1,
    flexDirection: 'column',
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);

    this.state = {
      open: false,
    };
  }

  // Don't need this
  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  // Don't need this
  handleTouchTap() {
    this.setState({
      open: true,
    });
  }

  componentDidMount() {
      this.fetchData();
  }

  fetchData() {

      const request = new Request('http://demo7235469.mockable.io/transactions');
      var self = this;

      fetch(request)
      .then((response) => response.json())
      .then((responseJSON) => {
          console.log(responseJSON)
          self.data = responseJSON;
          self.setState({data: responseJSON});
      })
      .catch((error) => {
          // TODO: Handle error responses somehow
          console.log(error);
      })
  }

  render() {
    const standardActions = (
      <FlatButton
        label="Ok"
        primary={true}
        onTouchTap={this.handleRequestClose}
      />
    );

    if (this.data === undefined) {
        return (
          <MuiThemeProvider muiTheme={muiTheme}>
            <CircularProgress/>
          </MuiThemeProvider>
        )
    } else {

        return (
          <MuiThemeProvider muiTheme={muiTheme}>
            <div style={styles.container}>
            <h1> Your Transaction History </h1>
            <h2>
                Total Balance: {this.state.data.accounts.map(account => (
                    account.balance
                )).reduce((a,b) => a+b, 0)}
            </h2>
              {this.state.data.transactionData.transactions.map(transaction => (
                  <Transaction
                        key={transaction.transactionId}
                        transaction={transaction}
                        >
                </Transaction>

              ))}
            </div>
          </MuiThemeProvider>
        );
    }
  }
}

export default App;
