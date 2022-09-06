import { useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../UserContext";
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
    const { user,setUser } = useContext(UserContext);

    return <Wrapper>
        <Link to='/' className="Logo"><h1>Progression</h1></Link>
        {user ? <div className="FeatureContainer">
            <NavLink to='/profile'>Profile</NavLink>
            <NavLink to='/daily-task'>Daily Task</NavLink>
            <button className="logout" onClick={()=>{setUser(null)}}>Logout</button>
        </div>
            : <Link className="NavLink" to="/login">
                Login
            </Link>
        }


    </Wrapper>

}

export default NavBar;

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    .Logo{
        text-decoration: none;
    }
    .FeatureContainer{
        display: flex;
    }
    .NavLink{
        text-decoration: none;

    }
`;