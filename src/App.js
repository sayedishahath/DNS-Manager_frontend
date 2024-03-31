// import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import Register from './components/userRegistartion'
import Login from  './components/userLogin'
import HostedZone from './components/hostedZone';
import Records from './components/hostedZoneRecords'
import { UserContext } from './context/userContext';
import { useReducer,useState,useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, } from "react-router-dom";
const initialState = {
  domain:[]
}
const DNSReducer = (action,state) =>{
  switch(action.type){
    case "GET_HOSTEDZONE":{
      // console.log("list")
      return {...state,domain : action.payload};
    }
    case "ADD_HOSTEDZONE":{
      // console.log("Add")
      return{...state,domain:[...state.domain,action.payload]};
    }
    case "REMOVE_HOSTEDZONE":{
      return {...state,domain:state.domain.filter((ele)=>{
        return ele.zoneId!==action.payload.zoneId
      })}
    }
    default:{
      return state
    }
  }
}
function App() {
  const[hostedZone,dispatchHostedZone] = useReducer(DNSReducer,initialState)
  const [userLoggedIn,setUserLoggedIn] =useState(false)  
  const loginSuccess=()=>{
    setUserLoggedIn(true)
  }
  const logout =()=>{
    const confirmation = window.confirm('are you sure?')
    if (confirmation){
      setUserLoggedIn(false)
      localStorage.removeItem('token')
    }
  }
  useEffect(()=>{
    (async()=>{
      try{
        const response = await axios.get('https://dns-manager-x1h3.onrender.com/api/domain',{headers:{
          Authorization:localStorage.getItem('token')
        }})

        dispatchHostedZone({type:'GET_HOSTEDZONE',payload:response.data})
      }catch(err){
        alert(err.message)
        console.log(err)
      }
    })()
  },[])
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <h1>DNS Manager</h1>
          <UserContext.Provider value={{hostedZone,dispatchHostedZone}}>
            {!userLoggedIn&&<Register/>}
            <Routes>
              <Route path="/login" element={<Login loginSuccess={loginSuccess} />} />
              <Route path='/hostedZone' element={<HostedZone/>}/>
              <Route path = '/hosted-zone/:zoneId/record' element={<Records/>}/>
            </Routes>
          {userLoggedIn&&<Link to ='/logout' onClick={logout}>logout</Link>}
          </UserContext.Provider>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App;