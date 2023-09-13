

function validatorMapper(errors=[]){
    let message={}
    errors.forEach((error)=>{
        message[error.path]=error.msg
    })
    return message;
}

module.exports={
    validatorMapper
}