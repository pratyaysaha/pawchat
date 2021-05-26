const logout=async()=>{
    const url=`${window.location.origin}/api/user/logout`
    await fetch(url)
        .then((response)=>response.json())
        .then((back)=>{
            if(back.status)
                location.assign(`${window.location.origin}/login`)
            else
            {
                alert("Error!!!")
                return
            }
        })
    }