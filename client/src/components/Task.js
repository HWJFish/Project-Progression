
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
    
    return <Wrapper>
        <h3>{task.taskName||"Anonymous Progress"}</h3>
        {task.steps.map((step,index)=>{
            
            return <p className="step" key={'step-'+index}>{(step.isCompleted?'✔️':'')+step.description}</p>
            
        })}
        <p className="timeContainer">
            <span>Start date: {format(new Date(task.startTime),'yyy-MMM-d')} </span>
            <span>Time spent: {`${(task.time/60000).toFixed(2)} minutes`}</span>
        </p>
    </Wrapper>
}

export default Task;
const Wrapper=styled.div`
    margin: 20px 0;

    .timeContainer{
        margin: 5px 0;
    }
    .step{
        margin: 3px 0;
    }
`