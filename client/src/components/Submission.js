import { useState, useContext, useRef } from 'react';
import styled from 'styled-components';
import { ProgressContext } from '../ProgressContext';
import { UserContext } from '../UserContext';


const Submission = () => {
    const { timer, setTimer, resetTimer, task, setTask } = useContext(ProgressContext);
    const { user } = useContext(UserContext);
    const addTagRef = useRef(null);


    const addTag = () => {
        const newTag = addTagRef.current.value;
        if (newTag && !task.tags.includes(newTag)) {
            setTask({ ...task, tags: [...task.tags, newTag] });
        }
    }
    const submit=(e)=>{
        e.preventDefault();
    }

    return <Wrapper>
        <form onSubmit={submit}>
            <h2>Submission</h2>
            <label>
                Extra time you spent while not using the app:
                <input type='number' defaultValue={0} min='0' />
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
                <button onClick={addTag}>Add</button>
            </div>
            <button type='submit' >Submit</button>
        </form>
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