import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 100,
    backgroundColor: '#e6f7ff',
    flex: 1,
    flexDirection: 'column',
  },
  paper: {
      textAlign: 'left',
      fontWeight: 300,
      width: '80%',
      margin: 'auto',
      paddingTop: 25,
      paddingRight: 20,
      paddingBottom:25,
      paddingLeft: 20,
      marginTop: 20,

      deposit: {
          color: 'blue',
          fontSize: '20',
      },
      withdrawal: {
          color: 'yellow',
          fontSize: '20',
      },
      desc: {
          float: 'left',
      },
      runningBalance: {
          color: 'red',
          float: 'left',
      },
      category: {
          color: 'green',
      },
      date: {
          fontWeight: 500,
      },

  }

};

class Transaction extends Component {

    constructor(props: Props) {
        super(props);
    }

    render() {
        var action = this.props.transaction.amount >= 0 ? "deposit" : "withdrawal"
        return (
            <Paper style={styles.paper} className="transaction">
                <div className={action} style={eval("styles.paper." + action)}>
                    {action.toUpperCase() + ": "}
                    {"$" + Math.abs(this.props.transaction.amount) + " CAD "}
                </div>
                <div className='desc' style={styles.paper.desc}>
                    Description:
                    {this.props.transaction.description + " "}
                </div>
                <div className='runningBalance' style={styles.paper.runningBalance}>
                    Running Balance:
                    {"$" + this.props.transaction.runningBalance + " CAD "}
                </div>
                <div className='category' style={styles.paper.category}>
                    Category:
                    {this.props.transaction.category + " "}
                </div>
                <div className='date' style={styles.paper.date}>
                    Date:
                    {this.props.transaction.transactionDate + " "}
                </div>
            </Paper>
        )
    }
}

module.exports = Transaction;
