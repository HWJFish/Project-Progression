import { useContext } from "react";
import styled from "styled-components";
import { ProgressContext } from "../ProgressContext";

// task structure
// {
//     taskName,
//     _id,
//     userId,
//     steps:[{description,isCompleted}],
//     tags:[]
// }

//used to show on main page
const Task=()=>{
     const {task,setTask}=useContext(ProgressContext)
    
    return <Wrapper>
        <h3>{task.taskName}</h3>
        {task.steps.map((step,index)=>{
            
                return <div className="stepContainer">
                        <input type='checkbox' defaultChecked={step.isCompleted}/>
                        <input key={'step-'+index} defaultValue={step.description}/>
                    </div>
            
        })}
    </Wrapper>
}

export default Task;
const Wrapper=styled.div`
`