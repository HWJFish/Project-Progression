import { BrowserRouter as Router, Routes,Route } from "react-router-dom";
import {useEffect} from "react";
import GlobalStyles from "./GlobalStyles";
import styled from "styled-components";
import NavBar from "./components/NavBar";
import Login from "./pages/login";


function App() {

  
  return (
  <>
    <GlobalStyles/>
    <BackContainer>
      <BodyWrapper className='app'>
        <Router>
          <NavBar/>
          <Routes>
            <Route exact path='/' element={'home'}/>
            <Route exact path="/login" element={<Login/>}/>
            <Route exact path='*' element={'404-page-not-found'}/>
          </Routes>
        </Router>
        

      </BodyWrapper>
    </BackContainer>
    
  </>
  );
}

export default App;

const BackContainer=styled.div`
  /* background-color: aqua; */
`


const BodyWrapper=styled.div`
  
  max-width: 800px;
  width: 100%;
  height: 100vh;
  position: relative;
  left: 50%;
  transform: translate(-50%,0);

`;