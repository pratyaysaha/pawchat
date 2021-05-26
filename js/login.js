var eyestatus = true
const eyechange = (me) => {
    if (eyestatus) {
        me.innerHTML = '<i class="fas fa-eye-slash"></i>'
        eyestatus = false
        document.querySelector('.input.password').type = 'text'
    }
    else {
        me.innerHTML = '<i class="fas fa-eye"></i>'
        eyestatus = true
        document.querySelector('.input.password').type = 'password'
    }
}
const errorMessage=(message, code)=>{
    var error=document.querySelector('.error-message')
    var uname=document.querySelector('.input.username')
    var pass=document.querySelector('.input.password')
    if(code==101)
    {
        error.innerHTML=message
        uname.value=''
        uname.focus()
        pass.value=''
    }
    else if(code==102)
    {
        error.innerHTML=message
        pass.value=''
        pass.focus()
    }
}
const submit =async (btn)=>{
    btn.style.display = 'none'
    document.querySelector('.loading').style.display = 'block'
    var data={}
    if(document.querySelector('.input.username').value==='' || document.querySelector('.input.password').value==='')
    {
        alert('Fill up the required fields')
        btn.style.display = 'block'
        document.querySelector('.loading').style.display = 'none'
        return
    }
    data.username=document.querySelector('.input.username').value
    data.password=document.querySelector('.input.password').value
    console.log(data)
    const url = `${window.location.origin}/api/user/login`
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    }).then((Response) => Response.json())
    .then((back)=>{
        if(back.status)
            location.assign(`${window.location.origin}`)
        else
        {
            errorMessage(back.error, back.code)
            btn.style.display = 'block'
            document.querySelector('.loading').style.display = 'none'
            return
        }
    })
}