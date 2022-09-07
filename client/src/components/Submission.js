import { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ProgressContext } from '../context/ProgressContext';
import { UserContext } from '../context/UserContext';
import { Alert } from '@mui/material'

// a submission form including time and adding tags
const Submission = () => {
    const { timer, setTimer, resetTimer, task, setTask, resetTask } = useContext(ProgressContext);
    const { user } = useContext(UserContext);
    const addTagRef = useRef(null);
    const extraTimeRef = useRef(null);
    const [result, setResult] = useState(null);
    let resultTimeout = null;

    //add tag to task and reset field
    const addTag = () => {
        const newTag = addTagRef.current.value;
        if (newTag && !task.tags.includes(newTag)) {
            setTask({ ...task, tags: [...task.tags, newTag] });
            addTagRef.current.value = '';
        }
    }

    // do the calculation of that timer
    const getTotalTime = () => {
        let totalTime = extraTimeRef.current.value * 60 * 1000;
        totalTime += (timer.count) * timer.workTime * 60 * 1000;
        if (!timer.isBreak) {
            totalTime -= timer.time;
        }
        return totalTime;
    }

    // show the result for 5 second
    const showResult = (theResult) => {
        setResult(theResult)
        resultTimeout = setTimeout(() => {
            setResult(null);
        }, 5000);
    }

    // organize the result and submit to the server
    const submit = (e) => {
        e.preventDefault();
        fetch('/api/progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task: {
                    ...task,
                    startTime: timer.startTime,
                    time: getTotalTime(),
                    userId: user.id
                },
                id: user.id,
                tempKey: user.tempKey
            })
        }).then(res => res.json())
            .then(data => {
                //console.log(data)
                if (data.status === 200) {
                    resetTimer();
                    resetTask();
                    showResult({
                        result: 'success',
                        message: 'Success!'
                    });
                } else {
                    showResult({
                        result: 'error',
                        message: data.message
                    })
                }
            })
            .catch(
                error => console.log(error)
            )
    }

    //clean up for the result timeout
    useEffect(() => {
        return () => clearTimeout(result);
    }, [])

    return <Wrapper>
        {(timer.startStatus === 'interrupted' || timer.startStatus === 'stopped') &&
            <form onSubmit={submit}>
                <h2>Submission</h2>
                <div className='labelContainer'>
                    <label>
                        Extra time you spent while not using the app (minutes):
                        <input type='number' defaultValue={0} min='0' ref={extraTimeRef} />
                    </label>
                </div>
                {task.tags[0] && <div>
                    <h3>Current Tags</h3>
                    {task.tags.map((tag, index) => {
                        return <p className='tag' key={`tag-${index}`}>{tag}</p>
                    })}
                </div>}

                <div className='labelContainer'>
                    <label>
                        Add Tags:
                        <input ref={addTagRef} />
                    </label>
                    <button type='button' onClick={addTag}>Add</button>
                </div>
                <button className='submit' type='submit' >Submit</button>
            </form>}

        {result && <Alert severity={result.result}>{result.message}</Alert>}
    </Wrapper>

}

export default Submission;

const Wrapper = styled.div`
margin: 10px;
    .tag{
        border:1px solid var(--color-main);
        border-radius: 50%;
        padding: 5px;
        margin: 10px;
        display: inline-block;
    }
    .labelContainer{
        margin: 10px 0;
    }
    .submit{
        position: relative;
        left: 50%;
        transform: translate(-50%,0);
        font-size: 50px;
        margin: 20px 0;
        border-radius: 15px;
        padding: 10px;
    }
`;