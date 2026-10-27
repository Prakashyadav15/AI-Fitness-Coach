import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./reg.css"
function Reg(){
    const[name,setname]=useState("")
    const[email,setemail]=useState("")
    const[password,setpassword]=useState("")
    const [error,seterror]=useState("")
    const navigate=useNavigate()
    const creataccount=async(e)=>{
        e.preventDefault()
        if(name===""||email===""||password===""){
            seterror("Please enter all details")
            return;
        }
        try{
            let url="http://localhost:3000/reg"
            let options={
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({name,email,password})
            }
            const response=await fetch(url,options)
            const data=await response.json()
            if (response.ok){
                console.log("registred succefully",data)
                navigate("/log")
            }
            else{
                seterror("registration failed",data.message)
            }
        }
        catch(err){
            seterror("error while submit",err)
        }

    }
    return(
        <div className="form-cont">
            <form className="form">
                <h3>Create Account</h3>
                <lable>Name</lable>
                <input type="text" className="int" placeholder="name" onChange={(e)=>{setname(e.target.value)}} value={name}/>
                 <lable>Email</lable>
                <input type="text" className="int" placeholder="email" onChange={(e)=>{setemail(e.target.value)}} value={email}/>
                 <lable>Password</lable>
                <input type="password" className="int" placeholder="password" onChange={(e)=>{setpassword(e.target.value)}} value={password}/>
                <div className="but">
                    <button type="submit" onClick={creataccount} className="login">Submit</button>
                    {error && <p>{error}</p>}
                </div>
            </form>
        </div>
    )
}
export default Reg