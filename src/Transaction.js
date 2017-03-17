import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import {grey500, lightGreen500} from 'material-ui/styles/colors';

var displayNicely = require('./helpers.js');

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
      width: '70%',
      margin: 'auto',
      paddingTop: 20,
      paddingRight: 10,
      paddingBottom:20,
      paddingLeft: 10,
      marginTop: 15,

      deposit: {
          color: lightGreen500,
          fontSize: 20,
          fontWeight: 500,
          float: 'right'
      },
      withdrawal: {
          fontSize: 20,
          fontWeight: 500,
          float: 'right'
      },
      desc: {
          float: 'left',
          width: '100%',
          fontWeight: 500,
      },
      category: {
          color: grey500,
          float: 'left',
          width: '100%',
          fontWeight: 300,
      },
      date: {
          fontWeight: 300,
          year: {
              color: grey500,
          }
      },
      account: {
          fontWeight: 300,
      },

  }

}

//-------------------------------------
// Displays data for each transaction on a Paper
class Transaction extends Component {

    constructor(props: Props) {
        super(props);
        this.months = {
            "01": "Jan",
            "02": "Feb",
            "03": "Mar",
            "04": "Apr",
            "05": "May",
            "06": "Jun",
            "07": "Jul",
            "08": "Aug",
            "09": "Sep",
            "10": "Oct",
            "11": "Nov",
            "12": "Dec",
        }
    }

    displayDateNicely(date) {
        date = date.split('-');
        return (
            <span>
                <div>
                    <span> {this.months[date[1]]} </span>
                    <span> {date[2]} </span>
                </div>
                <div style={styles.paper.date.year}> {date[0]} </div>
            </span>
        )
    }

    render() {
        var action = this.props.transaction.amount >= 0 ? "deposit" : "withdrawal"
        var sign = this.props.transaction.amount >= 0 ? "+" : "-"
        return (
            <Paper style={styles.paper} className="transaction">
                <div className={action} style={eval("styles.paper." + action)}>
                    {sign + " "}
                    {"$" + Math.abs(this.props.transaction.amount).toFixed(2) + " CAD "}
                </div>

                <div className='date' style={styles.paper.date}>
                    {this.displayDateNicely(this.props.transaction.transactionDate)}
                </div>

                <Divider/>

                <div className='desc' style={styles.paper.desc}>
                    {this.props.transaction.description + " "}
                </div>

                <div className='category' style={styles.paper.category}>
                    {displayNicely(this.props.transaction.category + " ")}
                </div>

                <div className='account' style={styles.paper.account}>
                    {displayNicely(this.props.accountName)}
                </div>
            </Paper>
        )
    }
}

module.exports = Transaction;
