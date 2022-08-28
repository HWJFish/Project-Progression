import { useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../UserContext";
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
    const { user } = useContext(UserContext);

    return <Wrapper>
        <h1>Progression</h1>
        {user ? <div className="FeatureContainer">

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
    .FeatureContainer{

    }
    .NavLink{
        text-decoration: none;
        
    }
`;