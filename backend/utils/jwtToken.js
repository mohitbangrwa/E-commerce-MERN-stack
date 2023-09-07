// Creating and saving the token in cookie

const sendToken = (user,statuscode,res)=>{
    const token = user.getJwtToken();
    // options for cookie
    const options = {
        httpOnly:true,
        expires:new Date(
            Date.now + process.env.COOKIE_EXPIRE * 24*60*60*1000
        )
    }
    res.status(statuscode).cookie('token',token,options).json({
        success:true,
        user,
        token,
    }) // saving the token in cookie
}

module.exports = sendToken;
