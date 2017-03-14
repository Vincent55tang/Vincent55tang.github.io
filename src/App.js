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
import Checkbox from 'material-ui/Checkbox';

// checkbox group import
// not needed

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

    this.state = {
      open: false,
      drawerOpen: false,
      activeFilters: [],
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

  fetchData() {

      const request = new Request('http://demo7235469.mockable.io/transactions');
      var self = this;

      fetch(request)
      .then((response) => response.json())
      .then((responseJSON) => {
          self.data = responseJSON;
          self.setState({transactions: responseJSON.transactionData.transactions});
      })
      .catch((error) => {
          console.log(error);
      })

  }

  filteredTransactions(filters) {
      console.log('swag');
      return filters.length === 0 ? this.data.transactionData.transactions :
      this.data.transactionData.transactions.filter((transaction) => {
          return this.state.activeFilters.includes(transaction.category)
      });
  }

  toggleDrawer = () => this.setState({drawerOpen: !this.state.drawerOpen});

  toggleFilter = (filter) => {
      var activeFilters = this.state.activeFilters;

      if (activeFilters.includes(filter)) {
          activeFilters.splice(activeFilters.indexOf(filter), 1);
      } else {
          activeFilters.push(filter);
      }

      this.setState({activeFilters: activeFilters});
  }

  clearFilters = () => this.setState({activeFilters: []});

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
                iconElementRight={<FlatButton label="Filter" onTouchTap={this.toggleDrawer} />}
                label="Open Drawer"
            >
            </AppBar>

            <Drawer
                style={styles.drawer}
                docked={false}
                width={300}
                open={this.state.drawerOpen}
                onRequestChange={(drawerOpen) => this.setState({drawerOpen})}
            >

                <div>
                    <FlatButton label="Clear" onTouchTap={this.clearFilters} />
                </div>
                Accounts
                <Divider/>
                {this.data.accounts.map(account => (
                    <div>
                        <Checkbox
                            label={account.accountName.toLowerCase().split('_').join(' ').replace(/\b\w/g, function(l) { return l.toUpperCase() })}
                            checked={this.state.activeFilters.includes(account)}
                            onCheck={(account) => this.toggleFilter(account)}
                        />
                    </div>
                ))}

                Categories
                <Divider/>

                {this.data.categories.map(category => (
                    <div>
                        <Checkbox
                            label={category.toLowerCase().split('_').join(' ').replace(/\b\w/g, function(l) { return l.toUpperCase() })}
                            checked={this.state.activeFilters.includes(category)}
                            onCheck={() => this.toggleFilter(category)}
                        />
                    </div>
                ))}

            </Drawer>

            <h2>
                Total Balance:
                {" $" + this.data.accounts.map(account => (
                    account.balance
                )).reduce((a,b) => a+b, 0) + " CAD"}
            </h2>

            {this.filteredTransactions(this.state.activeFilters).map(transaction => (
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
