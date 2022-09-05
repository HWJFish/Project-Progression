import { useState, useContext, useRef } from 'react';
import styled from 'styled-components';
import { ProgressContext } from '../ProgressContext';
import { UserContext } from '../UserContext';
import {Alert}from '@mui/material'


const Submission = () => {
    const { timer, setTimer, resetTimer, task, setTask,resetTask } = useContext(ProgressContext);
    const { user } = useContext(UserContext);
    const addTagRef = useRef(null);
    const extraTimeRef=useRef(null);
    const [result,setResult]=useState(null);
    let resultTimeout=null;


    const addTag = () => {
        const newTag = addTagRef.current.value;
        if (newTag && !task.tags.includes(newTag)) {
            setTask({ ...task, tags: [...task.tags, newTag] });
            addTagRef.current.value='';
        }
    }
    const getTotalTime=()=>{
        let totalTime=extraTimeRef.current.value*60*1000;
        totalTime+=(timer.count)*timer.workTime*60*1000;
        if(!timer.isBreak){
            totalTime-=timer.time;
        }
        return totalTime;
    }
    const showResult=(theResult)=>{
        setResult(theResult)
        resultTimeout=setTimeout(()=>{
            setResult(null);
        },5000);
    }
    const submit=(e)=>{
        e.preventDefault();
        fetch('/api/progress',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                task:{...task,
                    startTime:timer.startTime,
                    time:getTotalTime(),
                    userId:user.id
                },
                id:user.id,
                tempKey:user.tempKey
            })
        }).then(res=>res.json())
        .then(data=>{
            //console.log(data)
            if(data.status===200){
                resetTimer();
                resetTask();
                showResult({
                result:'success',
                message:'Success!'
            });
            }else{
                showResult({
                    result:'error',
                    message:data.message
                }) 
            }
        })
        .catch(
            error=>console.log(error)
        )
    }

    return <Wrapper>
        <form onSubmit={submit}>
            <h2>Submission</h2>
            <label>
                Extra time you spent while not using the app:
                <input type='number' defaultValue={0} min='0' ref={extraTimeRef}/>
            </label>
            {task.tags[0] && <div>
                <h3>Current Tags</h3>
                {task.tags.map((tag, index) => {
                    return <p className='tag' key={`tag-${index}`}>{tag}</p>
                })}
            </div>}

            <div>
                <label>
                    Add Tags:
                    <input ref={addTagRef} />
                </label>
                <button type='button' onClick={addTag}>Add</button>
            </div>
            <button type='submit' >Submit</button>
        </form>
        {result&&<Alert severity={result.result}>{result.message}</Alert>}
    </Wrapper>

}

export default Submission;

const Wrapper = styled.div`
    .tag{
       border:1px solid var(--color-main);
       border-radius: 50%;
       padding: 5px;
       margin: 10px;
        display: inline-block;
    }
`;