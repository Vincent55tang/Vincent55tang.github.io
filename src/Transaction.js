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
      marginTop: 30,
  }

};

class Transaction extends Component {

    constructor(props: Props) {
        super(props);
    }

    render() {
        if (this.props.transaction.amount >= 0) {
            return (
                <Paper style={styles.paper}>
                    Deposit:
                    {this.props.transaction.deposit + " "}
                    Description:
                    {this.props.transaction.description + " "}
                    Running Balance:
                    {this.props.transaction.runningBalance + " "}
                    Category:
                    {this.props.transaction.category + " "}
                </Paper>
            )
        } else {
            return (
                <Paper style={styles.paper}>
                    Withdrawal:
                    {this.props.transaction.withdrawal + " "}
                    Description:
                    {this.props.transaction.description + " "}
                    Running Balance:
                    {this.props.transaction.runningBalance + " "}
                    Category:
                    {this.props.transaction.category + " "}
                </Paper>
            )
        }
    }
}

module.exports = Transaction;
