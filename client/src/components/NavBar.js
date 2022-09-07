import { useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../context/UserContext";
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
    const { user, setUser } = useContext(UserContext);

    return <Wrapper>
        <Link to='/' className="Logo"><h1>Progression</h1></Link>
        
        {user ? <div className="FeatureContainer">
            <MyNavLink end className="NavLink" to='/'>Home</MyNavLink>
            <MyNavLink end className="NavLink" to='/profile'>Profile</MyNavLink>
            <MyNavLink end className="NavLink" to='/daily-task'>Daily Task</MyNavLink>
            <button className="logout NavLink" onClick={() => { setUser(null) }}>Logout</button>
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
        color: var(--color-main);
    }
    .FeatureContainer{
        display: flex;
        gap:20px;
        justify-content: center;
        align-items: center;
    }
    .NavLink{
        /* background-color: var(--color-white-grey); */
        padding: 10px;
        border: none;
        border-radius: 10px;
        font-weight: bold;
        font-size: 16px;
        text-decoration: none;
    }
    .logout{
        text-decoration: none;
        background-color: transparent;
        color: red;
    }
`;

const MyNavLink = styled(NavLink)`
    
    
    
        &.active{
            color:var(--color-main)
        }
`