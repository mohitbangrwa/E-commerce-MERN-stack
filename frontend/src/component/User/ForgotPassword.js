import React, { Fragment ,useEffect, useState} from 'react'
import MetaData from '../layout/MetaData';
import './ForgotPassword.css'
import Loader from '../layout/Loader/Loader'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import {useDispatch,useSelector} from 'react-redux';
import {clearErrors,forgotPassword} from '../../actions/userAction';
import {useAlert} from 'react-alert';


function ForgotPassword() {
    const dispatch = useDispatch();
    const alert = useAlert();
    const {error,message,loading} = useSelector(state=>state.forgotPassword);
    const [email,setEmail] = useState("");

    const forgotPasswordSubmit = (e)=>{
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("email",email);
        dispatch(forgotPassword(myForm));
    }

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors())
        }
        if(message){
            alert.success(message)
        }
    },[error,alert,dispatch,message])

    return (
        <Fragment>
                {loading?<Loader/>:
                    <Fragment>
                    <MetaData title="Forgot Password"/>
                    <div className='forgotPasswordContainer'>
                        <div className='forgotPasswordBox'>
                        <h2 className='forgotPasswordHeading'>Forgot Password</h2>
                        <form
                        className="forgotPasswordForm"
                        onSubmit = {forgotPasswordSubmit}
                    >
                        <div className='forgotPasswordEmail'>
                            <MailOutlinedIcon/>
                            <input
                                type="email"
                                placeholder='Email'
                                required
                                name="email"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                        </div>
                        <input
                            type="submit"
                            value="Update"
                            className="forgotPasswordBtn"
                            // disabled={loading?true:false}
                        />
                    </form>
        
                        </div>
                    </div>
                </Fragment>
                }
            </Fragment>
    )
}

export default ForgotPassword