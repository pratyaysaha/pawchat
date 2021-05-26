var eyestatus = true
var avatarChange = true
var userValid = true
var fd = new FormData()
var picElem = document.querySelector('.pic-wrapper')
var el = document.querySelector('.img-process')
var imgElem = document.querySelector('.img')
var vanilla = new Croppie(el, {
    viewport: { width: 100, height: 100, type: 'circle' },
    boundary: { width: 400, height: 400 },
    showZoomer: true,
    enableOrientation: false
});
const changed = (val) => {
    if (avatarChange)
        picElem.style.backgroundImage = `url(/${val}profilepic.svg)`
}
const filechoose = () => {
    var inputFile = document.querySelector('.profile-pic')
    inputFile.click()
    avatarChange = false
}
const playwithimg = (evt) => {
    imgElem.style.display = 'flex'
    vanilla.bind({
        url: URL.createObjectURL(evt.target.files[0]),
    });
}
const nopic = () => {
    var gender = document.querySelector('.input.gender').value
    picElem.style.backgroundImage = `url(/${gender}profilepic.svg)`
    document.querySelector('.remove-btn').style.display = 'none'
    avatarChange = true
}
const completeProcess = () => {
    vanilla.result('base64')
        .then((img) => {
            picElem.style.backgroundImage = `url(${img})`
            imgElem.style.display = 'none'
            document.querySelector('.remove-btn').style.display = 'block'
        })
    vanilla.result('blob')
        .then((image) => {
            fd.append('image', image)
        })
}
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
const checkme = async (val) => {
    const url = `${window.location.origin}/api/user/search/username/${val}`
    await fetch(url)
        .then((Response) => Response.json())
        .then((back) => {
            if (back.status && back.isValid) {
                userValid = true
                document.querySelector('.error-message').innerHTML = ''
            }
            else if (back.status && !back.isValid) {
                userValid = false
                document.querySelector('.input.username').focus()
                document.querySelector('.error-message').innerHTML = "Username already taken"
            }
            else {
                userValid = false
                console.error('Try again...Server Error')
            }
        })
}
const validEmail=(email)=>{
    var mailformat = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/
    if(email.match(mailformat))
    {
        document.querySelector(".input.email").style.color='#444'
        return true;
    }
    else
    {
        document.querySelector(".input.email").focus()
        document.querySelector(".input.email").style.color='red'
        return false;
    }
}
const submit = async (btn) => {
    btn.style.display = 'none'
    document.querySelector('.loading').style.display = 'block'
    if (!userValid || !validEmail(document.querySelector('.input.email').value)) {
        btn.style.display = 'block'
        document.querySelector('.loading').style.display = 'none'
        return
    }
    fd.append('name', document.querySelector('.input.name').value)
    fd.append('username', document.querySelector('.input.username').value)
    fd.append('gender', document.querySelector('.input.gender').value)
    fd.append('email', document.querySelector('.input.email').value)
    fd.append('password', document.querySelector('.input.password').value)
    for (pair of fd.entries()) {
        if (pair[1] === '') {
            alert('Fill the fields!!');
            btn.style.display = 'block'
            document.querySelector('.loading').style.display = 'none'
            return
        }
    }
    if (avatarChange === false) {
        const url = `${window.location.origin}/api/image/upload`
        await fetch(url, {
            method: 'POST',
            body: fd
        }).then((Response) => Response.json())
            .then((back) => {
                console.log(back)
                if (back.status) {
                    fd.append('isProfilePic', true)
                    fd.append('imgLocation', back.data.Location)
                    fd.delete('image')
                }
                else {
                    btn.style.display = 'block'
                    document.querySelector('.loading').style.display = 'none'
                    return
                }
            })
    }
    else {
        fd.append('isProfilePic', false)
        fd.delete('image')
        fd.delete('imgLocation')
    }
    var output = {}
    for (pair of fd.entries()) {
        output[`${pair[0]}`] = pair[1]
    }
    console.log(output)
    const url2 = `${window.location.origin}/api/user/signup`
    await fetch(url2, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(output)
    }).then((Response) => Response.json())
        .then((back) => {
            console.log(back)
            if (back.status)
                location.assign(`${window.location.origin}/login`)
            else {
                alert('Try Again!!');
                btn.style.display = 'block'
                document.querySelector('.loading').style.display = 'none'
                return
            }

        })
}