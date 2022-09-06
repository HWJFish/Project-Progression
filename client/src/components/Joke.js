import { useState } from "react";
import styled from "styled-components";


const Joke=()=>{
    const [joke,setJoke]=useState(null);
    useState(()=>{
        fetch(`https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single`)
        .then(res=>res.json())
        .then(data=>setJoke(data.joke))
        .catch(error=>{
            setJoke('Oops, the Joke api is not working or out of limit');
        })
    },[])

    return <Wrapper>
        <p>A Joke for break: {joke}</p>
    </Wrapper>
}

export default Joke;

const Wrapper=styled.div`

`;