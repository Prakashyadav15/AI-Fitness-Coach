import { useState,useEffect } from "react"
import { useNavigate,Link } from "react-router-dom"
import Cookies from "js-cookie"
import "./reg.css"
function Login(){
    const[name,setname]=useState("")
    const[password,setpassword]=useState("")
    const[error,seterror]=useState("")
    const navigate=useNavigate()

    useEffect(()=>{
        const token=Cookies.get("token")
        if(token){
            navigate("/home")
        }
    },[navigate])

    const login=async(e)=>{
        e.preventDefault()
        try{
            let url="http://localhost:3000/log"
            let options={
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({name,password})
            }
            const response=await fetch(url,options)
            const data=await response.json()
            if(response.ok && data.message==="Login successful"){
                // console.log(data)
                Cookies.set("token",data.token,{expires:7})
                navigate('/home')
            }else{
                seterror("invalid details")
            }
        }
        catch(err){
            seterror("invalid details",err)
        }
    }
    return(
        <div className="cont-form">
            <form className="form">
                <h3>Start Your Session</h3>
                 <lable>Name</lable>
                <input type="text" className="int" placeholder="name" onChange={(e)=>{setname(e.target.value)}} value={name}/>
                 <lable>Password</lable>
                <input type="password" className="int" placeholder="password" onChange={(e)=>{setpassword(e.target.value)}} value={password}/>
                <div className="but">
                    <button type="submit" onClick={login} className="login">Login</button>
                    <p>{error}</p>
                </div>
                <p> To Create account <Link to="/reg">click here</Link></p>
            </form>
        </div>
    )
}
export default Login