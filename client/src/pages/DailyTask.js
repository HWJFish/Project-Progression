import styled from "styled-components";
import UserInfo from "../components/UserInfo";
import { CircularProgress } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { ProgressContext } from "../ProgressContext";



const DailyTask = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { task, setTask, resetTask } = useContext(ProgressContext);
    const [tasks, setTasks] = useState([]);


    const [isLoading, setIsLoading] = useState(true);
    const ref = useRef(null);

    const addDailyTask = () => {
        if (ref.current.value) {
            const requestBody = {
                id: user.id,
                tempKey: user.tempKey,
                task: ref.current.value
            }
            fetch('/api/post-daily-tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            })
                .then(res => res.json())
                .then((data) => {
                    if (data.status === 200) {
                        setTasks(data.data)
                    } else {
                        console.log('Error:', data.message)
                    }
                    setIsLoading(false);
                }).catch(error => {
                    console.log(error);
                    setIsLoading(false);
                })
        }
    }
    const startTask = (task) => {
        setTask({
            taskName: task,
            userId: '',
            steps: [],
            tags: []
        })
        navigate('/');
    }

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setIsLoading(true);
            const requestBody = {
                id: user.id,
                tempKey: user.tempKey
            }

            fetch('/api/get-daily-tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            })
                .then(res => res.json())
                .then((data) => {
                    if (data.status === 200) {
                        setTasks(data.data)
                    } else {
                        console.log('Error:', data.message)
                    }
                    setIsLoading(false);
                }).catch(error => {
                    console.log(error);
                    setIsLoading(false);
                })
        }
    }, [])

    return <Wrapper>
        {user && <UserInfo />}
        {user && <div>
            <label>
                Add a task
                <input ref={ref} />
            </label>
            <button onClick={addDailyTask}>Add</button>
            {isLoading ? <CircularProgress />
                : tasks.length > 0 ? tasks.map((task) => {
                    return <p key={task._id}  >{task.task}<button onClick={() => startTask(task.task)}>start this task</button></p>
                }) : <p>No result found. Start adding one!</p>}

        </div>}


    </Wrapper>

}

export default DailyTask;

const Wrapper = styled.div`

`;