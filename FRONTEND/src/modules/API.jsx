async function tokenVerification (){
    //getting access token from localstorage
    const token = localStorage.getItem('token');

    if(!token){
        //running refresh if there is no token
        const response = await fetch("http://localhost:3000/refresh",{
            method : "GET",
            headers: {
                "Content-Type" : "application/json",
            },
            credentials : "include"
        })
        
        if(!response.ok){
            //going back to login incase there is no token
            window.location.href = 'http://localhost:5173/admin/login'
            return ;
        } else{
            const data = await response.json()
            localStorage.setItem('token', data.accessToken)
            return  data.accessToken
        }
    }else{
        return token
    }
}

export async function apiFetch({url, method ='GET', body, isAuth=true}){

    //setting the header values
    var headers = {
        "Content-Type" : "application/json",
    };

    if(isAuth === true){
        const token = await tokenVerification();
        
        headers = {
            ... headers,
            "Authorization" : `Bearer ${token}`
        };
    };

    try{
        const response = await fetch(`http://localhost:3000/${url}`,{
            method,
            body : body ? JSON.stringify(body) : null,
            headers,
            credentials : "include"
        })

        if(!response.ok){
            if(response.status === 401){
                const token = localStorage.getItem('token');
                if(token){
                    localStorage.removeItem('token');
                    apiFetch({url:url, method:method, body:body, isAuth:isAuth});
                }
            }
            throw new Error("Could not fetch resources");
        };

        return response.json();
    } catch(err){
        console.error(err);
    }
}