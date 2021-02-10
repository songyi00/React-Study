import React, { Component } from 'react';
import Customer from './components/Customer'
import CustomerAdd from './components/CustomerAdd'
import './App.css';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell'; 
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

/*
 리액트 컴포넌트 실행 순서 (life cycle)
 1) constructor()
 2) componentWillMount()
 3) render() 
 4) componentDidMount()

 props or state 변경? => shouleComponentUpdate() 
*/

const styles = theme => ({
  root: {
    width : '100%',
    marginTop : theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 1080 //테이블 가로 크기를 화면 크기와 상관없이 1080으로 고정시킴 
  },
  progress : {
    margin : theme.spacing.unit * 2 
  }
})

class App extends Component {
  //props는 변경될 수 없는 데이터를 명시할 때, state는 변경될 수 있는 데이터를 명시할 때 사용  
  
  constructor(props) {
    super(props);
    this.state = {
      customers: '',
      completed: 0
    }
  }
  
  stateRefresh = () => {
    this.setState({
      customers: '',
      completed: 0
    });
    this.callApi()
        .then(res => this.setState({customers : res}))
        .catch(err => console.log(err));
  }

  componentDidMount() {
    this.timer = setInterval(this.progress, 20); //0.02초마다 progress 함수 실행 
    this.callApi() // body -> res 
      .then(res => this.setState({customers : res}))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/customers');
    const body = await response.json(); //위의 경로(서버)에서 값을 가져와서 json 형태로 바꿔준다. 
    return body;
  }
  //로딩화면 구현 
  progress = () => {
    const { completed } = this.state;
    this.setState({completed: completed >=100 ? 0 : completed + 1});
  }
  render(){
    const { classes } = this.props;
    return(
      <div>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell>이미지</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>생년월일</TableCell>
              <TableCell>성별</TableCell>
              <TableCell>직업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          { this.state.customers ? this.state.customers.map(c => {
              return (<Customer key = {c.id} id = {c.id} image = {c.image} name = {c.name} birthday = {c.birthday} gender = {c.gender} job = {c.job} />)
                }) : <TableRow><TableCell colSpan="6" align="center">
                    <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed}/>
                    </TableCell>
                  </TableRow>}
          </TableBody>
        </Table>
      </Paper>
      <CustomerAdd stateRefresh={this.stateRefresh}/> 
      </div>
    );
  }
}
// CustomerAdd에 함수 자체(stateRefresh)를 props형태로 넘김 
 
export default withStyles(styles)(App);
