import { useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";

const UserInfo=()=>{
    const {user}=useContext(UserContext);

    return user&&<Wrapper>
        <Link to='/profile'><img src={user.avatar_url} alt='user'/></Link>
        <p className="greeting">Hello {user.login}!</p>
    </Wrapper>
}

export default UserInfo;

const  Wrapper= styled.div`
    img{
        width: 100px;
    }
    .greeting{
        font-size: 25px;
    }
    display: flex;
    margin: 20px;
    align-items: center;
    gap:50px;
`;

