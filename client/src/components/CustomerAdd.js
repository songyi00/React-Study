import React from 'react';
import { post } from 'axios'; //서버 통신 

class CustomerAdd extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            file: null,
            userName: '',
            birthday: '',
            gender : '',
            job : '',
            fileName: ''
        }
    }

    handleFormSubmit = (e) => {
        e.preventDefault() 
        this.addCustomer()
            .then((response) => {
                console.log(response.data);
                this.props.stateRefresh();
            })
        this.setState({
            file : null,
            userName : '',
            birthday: '',
            gender : '',
            job : '',
            fileName : ''
        })
    }

    handleFileChange = (e) => {
        this.setState({
            file : e.target.files[0],
            fileName : e.target.value
        })
    }

    handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    addCustomer  = () => {
        const url = '/api/customers';
        const formData = new FormData();
        formData.append('image',this.state.file);
        formData.append('name',this.state.userName);
        formData.append('birthday',this.state.birthday);
        formData.append('gender',this.state.gender);
        formData.append('job',this.state.job);
        const config = {
            headers: {
                'content-type' : 'multipart/form-data' //보내야 하는 데이터 타입에 파일이 포함된 경우 
            }
        }
        return post(url,formData,config); 
    }

    render(){
        return (
        <div class = 'addDiv'>
            <form onSubmit={this.handleFormSubmit}>
                <h1>고객 추가</h1>
                이름 : <input type="text" name="userName" value= {this.state.userName} onChange={this.handleValueChange}/> <br/><br/>
                생년월일:  <input type="text" name="birthday" value= {this.state.birthday} onChange={this.handleValueChange}/> <br/><br/>
                성별 : <input type="text" name="gender" value= {this.state.gender} onChange={this.handleValueChange}/> <br/><br/>
                직업 : <input type="text" name="job" value= {this.state.job} onChange={this.handleValueChange}/> <br/><br/>
                프로필 이미지: <input type="file" name = "file" file={this.state.file} value = {this.state.fileName} onChange = {this.handleFileChange}/><br/><br/>

                <button type="submit">추가하기</button>
            </form>
        </div>
        )
    }
}

export default CustomerAdd; //외부에서 라이브러리로 사용할 수 있도록 export 