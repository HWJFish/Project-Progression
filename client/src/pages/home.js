import styled from "styled-components";
import UserInfo from "../components/UserInfo";
import Timer from "../components/Timer";
import TaskEditable from "../components/TaskEditable";
import Submission from "../components/Submission";
import { UserContext } from "../UserContext";
import { ProgressContext } from "../ProgressContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

const Home=()=>{
    const{user}=useContext(UserContext);
    const{timer}=useContext(ProgressContext);
    return <Wrapper>
        <UserInfo/>
        <Timer/>
        <TaskEditable/>
        
        {(timer.startStatus==='interrupted'||timer.startStatus==='stopped')&&
            (user?<Submission/>:<Link to='/login'>Login to submit</Link>)}
    </Wrapper>
}
export default Home;
const Wrapper= styled.div`

`