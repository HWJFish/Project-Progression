import { useContext, useRef } from "react";
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
const TaskEditable = () => {
    const { task, setTask } = useContext(ProgressContext);
    const ref = useRef(null);

    const updateStep = (step, index, newStep) => {
        const tempSteps = [...task.steps];
        tempSteps[index] = newStep;
        setTask({ ...task, steps: tempSteps });
    }
    const addStep = (newStep) => {
        const tempSteps = [...task.steps];
        tempSteps.push(newStep);
        setTask({ ...task, steps: tempSteps });
    }

    return <Wrapper>
        {task.taskName ? <><h2>{task.taskName}</h2>
            {task.steps.map((step, index) => {

                return <div className="stepContainer" key={'step-' + index}>
                        <input type='checkbox' checked={step.isCompleted} value='true' onChange={(e) => {

                            updateStep(step, index, { description: step.description, isCompleted: !step.isCompleted })
                        }} />
                        <input  value={step.description} onChange={(e) => {
                            updateStep(step, index, { description: e.target.value, isCompleted: step.isCompleted })
                        }} />
                    </div>

                

            })}
            <div>
                <input ref={ref} />
                <button onClick={() => {
                    const value = ref.current.value;
                    if (value) {
                        addStep({ description: value, isCompleted: false })
                        ref.current.value = '';
                    }
                }}>Add Task Step</button>
            </div>
        </>
            : <div>
                <input ref={ref} />
                <button onClick={() => {
                    const value = ref.current.value;
                    if (value) {
                        setTask({ ...task, taskName: value })
                    }
                }}>Add Task</button>
            </div>}
    </Wrapper>
}

export default TaskEditable;
const Wrapper = styled.div`
`