import { BrowserRouter as Router, Routes,Route } from "react-router-dom";

import GlobalStyles from "./GlobalStyles";
import styled from "styled-components";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Home from './pages/Home';
import Profile from "./pages/Profile";
import DailyTask from "./pages/DailyTask";


function App() {

  
  return (
  <>
    <GlobalStyles/>
    <BackContainer>
      <BodyWrapper className='app'>
        <Router>
          <NavBar/>
          <Routes>
            <Route exact path='/' element={<Home/>}/>
            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/profile" element={<Profile/>}/>
            <Route exact path="/daily-task" element={<DailyTask/>}/>
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
  /* background-color: #f7f7f7; */
`


const BodyWrapper=styled.div`
  
  max-width: 800px;
  width: 100%;
  height: 100vh;
  position: relative;
  left: 50%;
  transform: translate(-50%,0);
  padding: 0 10px;
  border-width: 0 2px;
  border-style:solid;
  border-color: #f7f7f7;
  
`;