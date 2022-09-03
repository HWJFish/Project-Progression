import styled from "styled-components";
import UserInfo from "../components/UserInfo";
import Timer from "../components/Timer";
import TaskEditable from "../components/TaskEditable";

const Home=()=>{
    
    return <Wrapper>
        <UserInfo/>
        <Timer/>
        <TaskEditable/>
    </Wrapper>
}
export default Home;
const Wrapper= styled.div`

`