import styled from "styled-components";
import {  CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useEffect, useState } from "react";
import { format } from 'date-fns'

const Timer = () => {
    //default values
    const LOCAL_KEY='timer';
    let workTime = 25, breakTime = 5, longBreakTime = 15;
    let iniCycle = {
        time: workTime * 1000 * 60,
        count: 1,
        isBreak: false,
        startStatus: 'notStart',
        workTime,
        breakTime,
        longBreakTime,
        startTime:null
    }
    // const [isInterrupted,setIsInterrupted]=useState(false);
    const loadData=()=>{
        let storage=window.localStorage.getItem(LOCAL_KEY);
        if(storage){
            storage=JSON.parse(storage);
            if(storage.startStatus!=='notStart'){
                storage.startStatus='interrupted'
                //setIsInterrupted(true);
            }

            return storage;

        }else return iniCycle;
    }
    const [timer, setTimer] = useState(()=>loadData());
    
    let timeInterval = null;
    //update the timer based on the change of time period
    const updatePeriod = (e) => {
        const newTimer = { ...timer, [e.target.id]: e.target.value }
        newTimer.time = newTimer.workTime * 1000 * 60;
        setTimer(newTimer);
    }
    const startTimer = () => {
        setTimer({...timer,startStatus:'started',startTime:Date.now()})
        
    }
    const stopTimer=()=>{
        setTimer({...timer,startStatus:'stopped'})
    }
    

    useEffect(()=>{
        window.localStorage.setItem(LOCAL_KEY,JSON.stringify(timer));
        if(timer.startStatus==='started'){
            // interesting note: setTimeout and setInterval works the same here
            timeInterval = setTimeout(() => {
                const newTimer = { ...timer };
                newTimer.time -= 1000;
                if (newTimer.time <= 0) {//actually should be ===0 but just incase
                    if (timer.isBreak) {
                        newTimer.count++;
                        newTimer.time=newTimer.workTime*1000*60;
                    } else {
                        if(timer.count%4===0){
                            newTimer.time=newTimer.longBreakTime*1000*60;
                        }else{
                            newTimer.time=newTimer.breakTime*1000*60;
                        }
                    }
                    newTimer.isBreak=!timer.isBreak;
                }
                
                setTimer(newTimer);
            }, 1000)
        }
        return ()=>clearTimeout(timeInterval);
    },[timer])

    return <Wrapper>
        {timer.startStatus==='interrupted'&&<div className="interruptBox">
                <p>An interruption was detected. Start time:{format(new Date(timer.startTime),'yyy-MMM-d')}</p>
            </div>}
        <div className="infoContainer">
            <p>Current Cycle: {timer.count}</p>
            <p>Status: {timer.isBreak?"Break":"Work"}</p>
        </div>
        <div className="progressWrapper">
            <CircularProgressbarWithChildren className="outerProgress"
                value={timer.time / 60000}  maxValue={timer.isBreak ? (timer.count%4!==0?timer.breakTime:timer.longBreakTime) : (timer.workTime)}
                counterClockwise='true' styles={buildStyles({pathColor:timer.isBreak?'aqua':'tomato'})}>
                <p className="time">{`${Math.floor(timer.time / 60000)}:${Math.floor(timer.time % 60000 / 1000)}`}</p>
            </CircularProgressbarWithChildren>

        </div>
        {// show start button and set period form
            timer.startStatus === 'notStart' && <div>
                <p >Period Length Setting:</p>
                <div className="labelContainer" onChange={updatePeriod}>

                    <label className="inputLabel">
                        Work:{' '}
                        <input type='number' min='1' max='60' className="inputField" id='workTime' name='workTime' defaultValue={workTime} />
                    </label>
                    <label className="inputLabel">
                        Break:{' '}
                        <input type='number' min='1' max='60' className="inputField" id='breakTime' name='breakTime' defaultValue={breakTime} />
                    </label>
                    <label className="inputLabel">
                        Long Break:{' '}
                        <input type='number' min='1' max='60' className="inputField" id='longBreakTime' name='longBreakTime' defaultValue={longBreakTime} />
                    </label>
                </div>
                <button className="start" onClick={startTimer}>Start</button>
            </div>}
        {timer.startStatus === 'started'&&<button onClick={stopTimer}>
                Stop
            </button>}
        {timer.startStatus==='stopped'||timer.startStatus==='interrupted'&&<div>
            <button onClick={startTimer}>Resume</button>
            <button onClick={()=>{setTimer(iniCycle)}}>Discard</button>
            </div>}



    </Wrapper>
}

export default Timer;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 100%;
    .infoContainer{
        display: flex;
        gap: 20px;
        padding: 20px;
    }
    .progressWrapper{
        width: 35%;
    }
    .outerProgress{
        
    }
    .time{
        font-size: 50px;
    }
    .start{
        position: relative;
        left: 50%;
        transform: translate(-50%,0);
        font-size: 50px;
        margin: 20px 0;
    }
    .labelContainer{
        display: flex;
        gap: 20px;
    }
    /* .innerProgress{
        width:85%;
        transform: rotate(20deg);
    } */
`;