import styled from "styled-components";
import UserInfo from "../components/UserInfo";
import { CircularProgress } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Task from "../components/Task";


const Profile=()=>{
    const navigate=useNavigate();
    const {user}=useContext(UserContext);
    const [tasks,setTasks]=useState([]);
    const [tag,setTag]=useState('');
    const [isLoading,setIsLoading]=useState(true);
    const ref=useRef(null);

    const searchTag=()=>{
        setTag(ref.current.value);
    }

    useEffect(()=>{
        if(!user){
            navigate('/login');
        }else{
            setIsLoading(true);
            const requestBody={
                id:user.id,
                tempKey:user.tempKey
            }
            if(tag){
                requestBody.tag=tag;
            }
            fetch('/api/get-progress',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            })
                .then(res=>res.json())
                .then((data)=>{
                    if(data.status===200){
                        setTasks(data.data)
                    }else{
                        console.log('Error:',data.message)
                    }
                    setIsLoading(false);
                }).catch(error=>{
                    console.log(error);
                    setIsLoading(false);
                })
        }
    },[tag])

    return <Wrapper>
        {user&&<UserInfo/>}
        {user&&<div>
            <label>
                Search for a tag: 
                <input ref={ref}/>
            </label>
            <button onClick={searchTag}>Search</button>
            {isLoading?<CircularProgress/>
                :tasks.length>0?<div className="task-container">
                    {
                        tasks.map((task)=>{
                            return <Task key={task._id}  task={task}/>
                        })
                    }
                </div>
                :<p>No result found. Start adding one!</p>}
            
        </div>}


    </Wrapper>

}

export default Profile;

const Wrapper=styled.div`
    margin: 20px 10px;

    .task-container{
        margin: 10px 0;
    }
`;