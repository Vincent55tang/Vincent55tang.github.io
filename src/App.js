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
import IconButton from 'material-ui/IconButton';
import ActionSwapVert from 'material-ui/svg-icons/action/swap-vert';

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
  },
  clrBtn: {
      width: '100%'
  },
  dateSort: {
      float: 'right',
  },
  filterType: {
      fontSize: 20,
      fontWeight: 300,
      padding: 20,
  },
  checkbox: {
      margin: 10,
      fontWeight: 100,
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

    // Store the json data for convenience so we don't keep making requests
    this.data = undefined;

    this.state = {
      open: false,
      drawerOpen: false,
      activeFilters: [],
      dateDesc: true,
    };
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

  filteredTransactions(filters, dateDesc) {
      var filtered = filters.length === 0 ? this.data.transactionData.transactions :
      this.data.transactionData.transactions.filter((transaction) => {
          // Kind of slow
          return filters.includes(transaction.category) || filters.includes(transaction.accountId)
      });

      if (dateDesc) {
          filtered = filtered.sort((a,b) => {
              return new Date(b.transactionDate) - new Date(a.transactionDate)
          })
      } else {
          filtered = filtered.sort((a,b) => {
              return new Date(a.transactionDate) - new Date(b.transactionDate)
          })
      }

      return filtered;

  }

  displayNicely(string) {
      return string.toLowerCase().split('_').join(' ').replace(/\b\w/g, function(l) { return l.toUpperCase() })
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

  reorder = () => this.setState({dateDesc: !this.state.dateDesc})

  render() {
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
                title={"My Balance $" + this.data.accounts.map(account => (
                    account.balance
                )).reduce((a,b) => a+b, 0) + " CAD"}
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
                    <FlatButton label="Clear" onTouchTap={this.clearFilters} style={styles.clrBtn} />
                </div>
                <div className="filterType" style={styles.filterType}>
                    Accounts
                </div>
                <Divider/>
                {this.data.accounts.map(account => (
                    <div>
                        <Checkbox
                            style={styles.checkbox}
                            label={this.displayNicely(account.accountName)}
                            checked={this.state.activeFilters.includes(account.accountId)}
                            onCheck={() => this.toggleFilter(account.accountId)}
                            key={account.accountName}
                        />
                    </div>
                ))}
                <div className="filterType" style={styles.filterType}>
                    Categories
                </div>
                <Divider/>

                {this.data.categories.map(category => (
                    <div>
                        <Checkbox
                            style={styles.checkbox}
                            label={this.displayNicely(category)}
                            checked={this.state.activeFilters.includes(category)}
                            onCheck={() => this.toggleFilter(category)}
                            key={category}
                        />
                    </div>
                ))}

            </Drawer>

                <IconButton
                    style={styles.dateSort}
                    onTouchTap={() => this.reorder()}
                >
                    <ActionSwapVert/>
                </IconButton>

            {console.log(this.filteredTransactions(this.state.activeFilters, this.state.dateDesc))}
            {this.filteredTransactions(this.state.activeFilters, this.state.dateDesc).map(transaction => (
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
