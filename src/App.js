import React, {Component} from 'react';

// material-ui imports
import CircularProgress from 'material-ui/CircularProgress';
import {grey200} from 'material-ui/styles/colors';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';

var Transaction = require('./Transaction.js');
// Required for tap event
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const styles = {
  container: {
    backgroundColor: grey200,
    flex: 1,
    flexDirection: 'column',
  },
  appBar: {
      fontWeight: 300
  }
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
    this.data = undefined;
    this.activeFilters = undefined;

    this.state = {
      open: false,
      drawerOpen: false,
    };
  }

  // Don't need this
  handleRequestClose() {
    this.setState({
      open: false,
      drawerOpen: false,
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

  filterOff(filter) {
      this.activeFilters.push(filter);
      var filtered = this.data.transactionData.transactions.filter(transaction => {
          this.activeFilters.includes(transaction.category)
      })
      this.setState({transactions: filtered});
  }

  clearFilters() {
      this.activeFilters = [];
      this.setState({transactions: this.data.transactionData.transactions});
  }

  fetchData() {

      const request = new Request('http://demo7235469.mockable.io/transactions');
      var self = this;

      fetch(request)
      .then((response) => response.json())
      .then((responseJSON) => {
          console.log(responseJSON)
          self.data = responseJSON;
          self.setState({transactions: responseJSON.transactionData.transactions});
      })
      .catch((error) => {
          console.log(error);
      })

  }

  toggleDrawer = () => this.setState({drawerOpen: !this.state.drawerOpen});

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
            <AppBar
                className="appBar"
                style={styles.appBar}
                title="Your Transaction History"
                iconElementRight={<FlatButton label="Filter" />}
                label="Open Drawer"
                onTouchTap={this.toggleDrawer}
            >
            </AppBar>

            <Drawer
                docked={false}
                width={300}
                open={this.state.drawerOpen}
                onRequestChange={(drawerOpen) => this.setState({drawerOpen})}
                >
                Categories
                <Divider/>
                {this.data.categories.map(category => (
                    <div>
                        {category.toLowerCase().split('_').join(' ').replace(/\b\w/g, function(l) { return l.toUpperCase() })}
                    </div>
                ))}
            </Drawer>

            <h2>
                Total Balance:
                {" $" + this.data.accounts.map(account => (
                    account.balance
                )).reduce((a,b) => a+b, 0) + " CAD"}
            </h2>
              {this.state.transactions.map(transaction => (
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
