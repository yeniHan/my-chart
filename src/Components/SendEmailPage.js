
        // const filename  = `${gType}_${this.state.file}.pdf`;
        // 
// let formD = new FormData()
// formD.append('pdf', blob)

// fetch('http://localhost:8080/getPDF', {
//     method: 'POST',
//     // headers: headers,
//     body: formD
// })
// .then((res)=>{
//     return res.json()
// })
// .then(json =>{
//     console.log(json)
// })
//     }
// });

import React from 'react';
import { connect } from 'react-redux';
import { asyncSendPdfs, inputEmail } from '../Actions/actionCreators';

class SendEmailPage  extends React.Component{
        constructor(props){
                super(props)
                this.state = {
                        email: '',
                        emailIsValid: false
                        
                }
        }

        changeEmail = (e) => {
                let {value} = e.target
                let valid = false

                if(value.indexOf('@') !== -1 ){
                        valid = true
                }
                this.setState({
                        ...this.state,
                        email: value,
                        emailIsValid: valid
                })
        }

        sendEmail = async() => {
                await this.props.inputEmail(this.state.email)
                this.props.asyncSendPdfs()
                
        }

        

        render(){
                return (
                        <div>   
                                <div className="input-box"><input type="txt" onChange={this.changeEmail}></input></div> 
                                <button disabled={!this.state.emailIsValid} onClick={this.sendEmail}>Send</button>
                        </div>
                )
        }
}


const mapStateToProps = (state) => ({
        pdfInfos: state.pdfInfos
})

const mapDispatchToProps = (dispatch) => ({
        asyncSendPdfs: () => dispatch(asyncSendPdfs()),
        inputEmail: (email) => dispatch(inputEmail(email))
})

export default connect(mapStateToProps, mapDispatchToProps)(SendEmailPage);