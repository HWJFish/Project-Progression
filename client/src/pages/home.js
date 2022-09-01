import styled from "styled-components";
import UserInfo from "../components/UserInfo";
import Timer from "../components/Timer";

const Home=()=>{
    
    return <Wrapper>
        <UserInfo/>
        <Timer/>
    </Wrapper>
}
export default Home;
const Wrapper= styled.div`

`