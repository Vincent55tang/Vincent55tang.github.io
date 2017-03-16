import React, {Component} from 'react';

// material-ui imports
import CircularProgress from 'material-ui/CircularProgress';
import {grey200, lightGreen500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import ActionSwapVert from 'material-ui/svg-icons/action/swap-vert';

var Transaction = require('./Transaction.js');
var displayNicely = require('./helpers.js');

// Required for tap event
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import './App.css'

const styles = {
  container: {
    backgroundColor: grey200,
    flex: 1,
    flexDirection: 'column',
  },
  appBar: {
      backgroundColor: lightGreen500,
      textAlign: 'center',
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
  },
  balance: {
      fontSize: '10px',
      height: '5px',
      color: grey200,
  },
};

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

      const request = new Request('https://demo7235469.mockable.io/transactions');
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

  //-------------------------------------
  // Utilities
  //-------------------------------------

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

  getAccountName(t, accs) {
      accs = accs.filter((a) => {
          return a.accountId === t.accountId
      });
      return accs[0].accountName;
  }

  render() {
    if (this.data === undefined) {
        return (
          <MuiThemeProvider>
            <CircularProgress/>
          </MuiThemeProvider>
        )
    } else {

        let title = (

            <span>
            <div className="balance" style={styles.balance}>
                YOUR BALANCE
            </div>
            <div>
                {"$" + this.data.accounts.map(account => (
                    account.balance
                )).reduce((a,b) => a+b, 0) + " CAD"}
            </div>
            </span>
        )

        return (
            <div className="App">
              <MuiThemeProvider>
                <div style={styles.container}>
                <AppBar
                    className="appBar"
                    style={styles.appBar}
                    title={title}
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
                        <FlatButton label="Clear" className="clrBtn" onTouchTap={this.clearFilters} style={styles.clrBtn} />
                    </div>
                    <div className="filterType" style={styles.filterType}>
                        Accounts
                    </div>
                    <Divider/>
                    {this.data.accounts.map(account => (
                        <div>
                            <Checkbox
                                style={styles.checkbox}
                                label={displayNicely(account.accountName)}
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
                                label={displayNicely(category)}
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

                {this.filteredTransactions(this.state.activeFilters, this.state.dateDesc).map(transaction => (
                    <Transaction
                        key={transaction.transactionId}
                        transaction={transaction}
                        accountName={this.getAccountName(transaction, this.data.accounts)}
                    >
                    </Transaction>

                  ))}
                </div>
              </MuiThemeProvider>
            </div>
        );
    }
  }
}

export default App;
