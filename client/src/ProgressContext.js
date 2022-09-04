import { createContext, useEffect, useState } from "react";
import {v4 as uuidv4} from 'uuid'

export const ProgressContext = createContext();



export const ProgressContextProvider = ({ children }) => {
    //default values
    const TIMER_KEY = 'timer';
    const TASK_KEY = 'task';
    let workTime = 25, breakTime = 5, longBreakTime = 15;
    const iniCycle = {
        time: workTime * 1000 * 60,
        count: 1,
        isBreak: false,
        startStatus: 'notStart',
        workTime,
        breakTime,
        longBreakTime,
        startTime: null
    }
    const loadData = () => {
        let storage = window.localStorage.getItem(TIMER_KEY);
        if (storage) {
            storage = JSON.parse(storage);
            if (storage.startStatus !== 'notStart') {
                storage.startStatus = 'interrupted'
                //setIsInterrupted(true);
            }

            return storage;

        } else return iniCycle;
    }
    const iniTask={
        taskName:'',
        _id:uuidv4(),
        userId:'',
        steps:[],
        tags:[]
    };
    
    const [timer, setTimer] = useState(() => loadData());
    const [task, setTask] = useState(() => {
        // task structure
        // {
        //     taskName,
        //     _id,
        //     userId,
        //     steps:[{description,isCompleted}],
        //     tags:[]
        // }
        const storage = window.localStorage.getItem(TASK_KEY);
        return storage ? JSON.parse(storage) : iniTask;
    })

    let timeInterval = null;
    //update the timer based on the change of time period
    useEffect(() => {
        window.localStorage.setItem(TIMER_KEY, JSON.stringify(timer));
        if (timer.startStatus === 'started') {
            // interesting note: setTimeout and setInterval works the same here
            timeInterval = setTimeout(() => {
                const newTimer = { ...timer };
                newTimer.time -= 1000;
                if (newTimer.time <= 0) {//actually should be ===0 but just incase
                    if (timer.isBreak) {
                        newTimer.count++;
                        newTimer.time = newTimer.workTime * 1000 * 60;
                    } else {
                        if (timer.count % 4 === 0) {
                            newTimer.time = newTimer.longBreakTime * 1000 * 60;
                        } else {
                            newTimer.time = newTimer.breakTime * 1000 * 60;
                        }
                    }
                    newTimer.isBreak = !timer.isBreak;
                }

                setTimer(newTimer);
            }, 1000)
        }
        return () => clearTimeout(timeInterval);
    }, [timer])


    useEffect(() => {
        window.localStorage.setItem(TASK_KEY, JSON.stringify(task));
    }, [task])

    const resetTimer=()=>{
        setTimer(iniCycle);
    }
    const resetTask=()=>{
        setTask(iniTask);
    }

    return <ProgressContext.Provider value={{ timer, setTimer, resetTimer, task, setTask,resetTask }}>
        {children}
    </ProgressContext.Provider>

}