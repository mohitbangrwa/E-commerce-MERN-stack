import React, { Fragment ,useEffect, useState} from 'react'
import MetaData from '../layout/MetaData';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import './UpdatePassword.css'
import Loader from '../layout/Loader/Loader'
import {useNavigate} from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux';
import {clearErrors,updatePassword} from '../../actions/userAction';
import {useAlert} from 'react-alert';
import { UPDATE_PASSWORD_RESET} from '../../constants/userConstants';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function UpdatePassword() {
    const dispatch = useDispatch();
    const alert = useAlert();
    const history = useNavigate();
    const {error,isUpdated,loading} = useSelector(state=>state.profile);
    
    const [oldPassword,setOldPassword] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");

    const updatePasswordSubmit = (e)=>{
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("oldPassword",oldPassword);
        myForm.set("newPassword",newPassword);
        myForm.set("confirmPassword",confirmPassword);
        dispatch(updatePassword(myForm));
    }
    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors())
        }
        if(isUpdated){
            alert.success("Password Changed Successfully")
            history("/account");
            dispatch({
                type:UPDATE_PASSWORD_RESET
            })
        }
    },[error,alert,dispatch,history,isUpdated])

    return (
        <Fragment>
            {loading?<Loader/>:
                <Fragment>
                <MetaData title="Change Password"/>
                <div className='updatePasswordContainer'>
                    <div className='updatePasswordBox'>
                    <h2 className='updatePasswordHeading'>Change Password</h2>
                    <form
                       className="updatePasswordForm"
                       onSubmit = {updatePasswordSubmit}
                   >
                    
                        <div className='loginPassword'>
                            <VpnKeyOutlinedIcon/>
                            <input
                                type="password"
                                placeholder='Old Password'
                                required
                                value={oldPassword}
                                onChange={(e)=>setOldPassword(e.target.value)}
                            />
                        </div>
                        <div className='loginPassword'>
                            <LockOpenOutlinedIcon/>
                            <input
                                type="password"
                                placeholder='New Password'
                                required
                                value={newPassword}
                                onChange={(e)=>setNewPassword(e.target.value)}
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
                           value="Change"
                           className="updatePasswordBtn"
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

export default UpdatePassword