import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../UserContext";
//import {v4 as uuidv4} from 'uuid';

// a new account with ids, no personal info, replace to your own if you want
const CLIENT_ID='04f57d6e43b45b687ba5';
const CLIENT_SECRETS='791dae8df446354c1f3ed2233e7490430f86bc4b';
const redirect_uri='http://localhost:3000/login';


// example `https://github.com/login/oauth/authorize?scope=user&client_id=${client_id}&redirect_uri=${redirect_uri}`


const Login=()=>{
    const [searchParams] = useSearchParams();
    const navigate=useNavigate();
    const {user,setUser}=useContext(UserContext);
    useEffect(()=>{
        // go back to main if already login
        if(user){
            navigate('/');
        }else// if have a code query redirected from github, fetch backend to login
        if(searchParams.get('code')){
            
            fetch('/api/login',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({code:searchParams.get('code')})
            }).then(res=>res.json())
            .then(data=>{
                
                if(data.data){
                    setUser(data.data);
                    navigate('/');
                }
                
            })
            .catch(error=>console.log('login Failed',error))
        }else{

        }
    },[])

    return <div>
        {!searchParams.code&&!user&&<a href={`https://github.com/login/oauth/authorize?scope=user:email&client_id=${CLIENT_ID}&redirect_uri=${redirect_uri}` }
            >Login with github</a>}
    </div>
}

export default Login;


