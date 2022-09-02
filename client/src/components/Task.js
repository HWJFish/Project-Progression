
import styled from "styled-components";

// task structure
// {
//     taskName,
//     _id,
//     userId,
//     steps:[{description,isCompleted}],
//     tags:[]
// }

// used to show existing task
const Task=({task})=>{
    // const [tasks,setTasks]=useState(tasks)
    
    return <Wrapper>
        <h3>{task.taskName}</h3>
        {task.steps.map((step,index)=>{
            
            return <p key={'step-'+index}>{(step.isCompleted?'✔️':'')+step.description}</p>
            
        })}
    </Wrapper>
}

export default Task;
const Wrapper=styled.div`
`