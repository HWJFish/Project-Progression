import { BrowserRouter as Router, Route } from "react-router-dom";
import {useEffect} from "react";


function App() {

  useEffect(()=>{
    fetch("/test")
      .then(res=>res.json())
      .then(data=>console.log(data))
  },[])
  return (
   <div>
    
   </div>
  );
}

export default App;
