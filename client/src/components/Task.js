
import styled from "styled-components";
import format from "date-fns/format";

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
        <h3>{task.taskName||"Anonymous Progress"}</h3>
        {task.steps.map((step,index)=>{
            
            return <p key={'step-'+index}>{(step.isCompleted?'✔️':'')+step.description}</p>
            
        })}
        <p>
            <span>Start date: {format(new Date(task.startTime),'yyy-MMM-d')} </span>
            <span>Time spent: {`${(task.time/60000).toFixed(2)} minutes`}</span>
        </p>
    </Wrapper>
}

export default Task;
const Wrapper=styled.div`
`