import styled from "styled-components";
import {  CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {  useContext} from "react";
import { format } from 'date-fns';
import { ProgressContext } from "../context/ProgressContext";
import Joke from "./Joke";


const Timer = () => {
    
    
    
    const {timer, setTimer,resetTimer} = useContext(ProgressContext);
    
    
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
    

    

    return <Wrapper>
        {timer.startStatus==='interrupted'&&<div className="interruptBox">
                <p>An interruption was detected. Start time:{format(new Date(timer.startTime),'yyy-MMM-d')}</p>
            </div>}
        {
            timer.isBreak&&<Joke/>
        }
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
            timer.startStatus === 'notStart' && <div className="period-setting">
                <p className="period-title">Period Length Setting:</p>
                <div className="labelContainer" >

                    <label className="inputLabel">
                        Work:{' '}
                        <input type='number' min='1' max='60' className="inputField" id='workTime' name='workTime' value={timer.workTime} onChange={updatePeriod}/>
                    </label>
                    <label className="inputLabel">
                        Break:{' '}
                        <input type='number' min='1' max='60' className="inputField" id='breakTime' name='breakTime' value={timer.breakTime} onChange={updatePeriod}/>
                    </label>
                    <label className="inputLabel">
                        Long Break:{' '}
                        <input type='number' min='1' max='60' className="inputField" id='longBreakTime' name='longBreakTime' value={timer.longBreakTime} onChange={updatePeriod}/>
                    </label>
                </div>
                <button className="action start" onClick={startTimer}>Start</button>
            </div>}
        {timer.startStatus === 'started'&&<button className="action" onClick={stopTimer}>
                Stop
            </button>}
        {timer.startStatus==='stopped'||timer.startStatus==='interrupted'&&<div className="continue-container">
            <button className="action" onClick={startTimer}>Resume</button>
            <button className="action" onClick={resetTimer}>Discard</button>
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
    .action{
        
        font-size: 50px;
        margin: 20px 0;
        border-radius: 15px;
        border: none;
        padding: 10px;
    }
    .start{
        position: relative;
        left: 50%;
        transform: translate(-50%,0);
    }
    .labelContainer{
        display: flex;
        gap: 20px;
    }
    .period-setting{
        margin: 20px 0 10px 0;
    }
    .period-title{
        margin:10px 0;
    }
    .continue-container{
        display: flex;
        gap: 20px;
    }
`;