import React, { Fragment ,useEffect, useState} from 'react'
import MetaData from '../layout/MetaData';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import './ResetPassword.css'
import Loader from '../layout/Loader/Loader'
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux';
import {clearErrors,resetPassword} from '../../actions/userAction';
import {useAlert} from 'react-alert';
import { UPDATE_PASSWORD_RESET} from '../../constants/userConstants';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function ResetPassword() {
    const dispatch = useDispatch();
    const {token} = useParams();
    const alert = useAlert();
    const history = useNavigate();
    const {error,success,loading} = useSelector(state=>state.forgotPassword);
    
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");

    const resetPasswordSubmit = (e)=>{
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("password",password);
        myForm.set("confirmPassword",confirmPassword);
        dispatch(resetPassword(token,myForm));
    }
    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors())
        }
        if(success){
            alert.success("Password Updated Successfully")
            history("/login");
            dispatch({
                type:UPDATE_PASSWORD_RESET
            })
        }
    },[error,alert,dispatch,history,success])

    return (
        <Fragment>
            {loading?<Loader/>:
                <Fragment>
                <MetaData title="Reset Password"/>
                <div className='resetPasswordContainer'>
                    <div className='resetPasswordBox'>
                    <h2 className='resetPasswordHeading'>Change Password</h2>
                    <form
                       className="resetPasswordForm"
                       onSubmit = {resetPasswordSubmit}
                   >
                        <div className='loginPassword'>
                            <LockOpenOutlinedIcon/>
                            <input
                                type="password"
                                placeholder='New Password'
                                required
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                            />
                        </div>
                        <div className='loginPassword'>
                            <LockOutlinedIcon/>
                            <input
                                type="password"
                                placeholder=' Confirm Password'
                                required
                                value={confirmPassword}
                                onChange={(e)=>setConfirmPassword(e.target.value)}
                            />
                        </div>
                       
                       <input
                           type="submit"
                           value="Update"
                           className="resetPasswordBtn"
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

export default ResetPassword;