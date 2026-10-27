import "./home.css"
import Cookies from "js-cookie"
import { useEffect,useState } from "react"
import { useNavigate } from "react-router-dom"
function Home(){
    const[height,setheight]=useState("")
    const[weight,setweight]=useState("")
    const[gender,setgender]=useState("Male")
    const[goals,setgoals]=useState("Fat Loss")
    const[time,settime]=useState("")
    const[dislike,setdislike]=useState("")
    const[type,settype]=useState("Veg")
    const[age,setage]=useState("")
    const[error,seterror]=useState("")
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate()
    useEffect(()=>{
        
        const verify=async()=>{
            const token=Cookies.get("token")

             if (!token) {
            navigate("/log");
            return;
             }

          try{
              let url="http://localhost:3000/verify"
            const option={
                method:"GET",
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            }
            const response=await fetch(url,option)
            const data=await response.json()

            if(!response.ok||!data.auth){
                navigate("/log")
            }
            console.log(data.user)
            }
            catch(err){
                 console.error("Verification failed:", err);
                navigate("/log");
            }
          }
        verify()
    },[navigate])
 
    const handlesubmit=async(e)=>{
        e.preventDefault()
        if(height===""||weight===""||time===""||dislike===""||age===""){
        seterror("please fill all the details")
            return;
         }
          
        const token=Cookies.get("token")
        try{
            
            let url="http://localhost:3000/details"
            const option={
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                },
                body:JSON.stringify({
                    height,
                    weight,
                    gender,
                    goals,
                    time,
                    dislike,
                    type,
                    age
                })
            }
            const responsive=await fetch(url,option)
            const data=await responsive.json()
            if(responsive.ok){
                console.log("Details saved Now generating plan")
                if (loading) return;
                setLoading(true);
                let planurl="http://localhost:3000/generate-plan"
                const planoption={
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${token}`
                    }
                }
                const planresponse=await fetch(planurl,planoption)
                const plandata=await planresponse.json()

                if(planresponse.ok){
                    setheight("");
                    setweight("");
                    settime("");
                    setdislike("");
                    setage("")
                    
                     navigate("/diet")
                    console.log(plandata)
                    console.log("Generated plan")
                    }else {
                        seterror("Failed to generate plan");
                    }

            }else {
                seterror(data.message || "Failed to generate plan");
            }
            
        }
        catch(err){
            console.log(err,"error while posting");
            seterror("Something went wrong while submitting");
        }finally {
        setLoading(false);
    }
    }
 


    return(
        <>
        <div className="home">
            <div className="quote">
             <h1><span>DISCIPLINE</span>
                <br/> is the bridge between<br/>
                 <span>GOALS</span> and <span>RESULTS</span>
                </h1>
                <p>Get a complete, customized diet and exercise plan<br/> based on your unique goals and preferences.</p>
            </div>
        </div>
       <div className="home-bg">
         <div className="details">
            <form className="forms">
                <h3 className="head">Let’s personalize your plan</h3>
                <div className="order-h">                 
                   <div>
                     <label className="section-label">Height(cm)</label>
                     <input type="text"  onChange={(e)=>{setheight(e.target.value)}} value={height} className="int"/>
                   </div>
                    <div className="weight">
                      <label className="section-label">Weight(kg)</label>
                        <input type="text"  onChange={(e)=>{setweight(e.target.value)}} value={weight} className="int"/> 
                    </div>
                    
                </div>
             <div className="order">
                {/* Gender Section */}
                <div className="gender">
                    <label className="section-label">Gender</label>
                    <div className="radio-group">
                    {["Male", "Female", "Others"].map((option) => (
                        <label
                        key={option}
                        className={`radio-button ${gender === option ? "active" : ""}`}
                        >
                        <input
                            type="radio"
                            name="gender"
                            value={option}
                            checked={gender === option}
                            onChange={(e) => setgender(e.target.value)}
                        />
                        {option}
                        </label>
                    ))}
                    </div>
                </div>

                {/* Goals Section */}
                <div >
                    <label className="section-label">Goals</label>
                    <div className="radio-group">
                    {["Fat Loss", "Bulking", "Strengthening"].map((option) => (
                        <label
                        key={option}
                        className={`radio-button ${goals === option ? "active" : ""}`}
                        >
                        <input
                            type="radio"
                            name="goals"
                            value={option}
                            checked={goals === option}
                            onChange={(e) => setgoals(e.target.value)}
                        />
                        {option}
                        </label>
                    ))}
                    </div>
                     <div className="time">
                        <label className="section-label">Age</label>
                        <input type="number"  onChange={(e)=>{setage(e.target.value)}} value={age} className="int"/> 
                    </div>
                </div>
               
             </div>
                  <img src="photos/Gemini_Generated_Image_6vl84k6vl84k6vl8.png" alt="img" className="side-image"/>              
            </form>
            </div>
         <div>
          <div className="details-second">
                <form className="forms">

                   <div>
                     <img src="photos/Gemini_Generated_Image_b8rc3fb8rc3fb8rc.png" alt="img" className="side-image"/>

                    <h3 className="diet">Diet Preferences</h3>
                     <label className="section-label" >Your type</label>
                     <div className="radio-group">
                    {["Veg","Non-Veg"].map((option)=>(
                        <label key={option} className={`radio-button ${type === option ? "active" : ""}`}>
                            <input 
                            type="radio"
                            name="type"
                            value={option}
                            checked={type===option} 
                            onChange={(e)=>{settype(e.target.value)}}/>
                            {option}
                        </label>
                    ))}
                     </div>
                     <div className="time">
                    <label className="section-label">Time to Reminde</label>
                    <input type="text" placeholder="6am or 6pm" onChange={(e)=>{settime(e.target.value)}} value={time} className="int"/> 
                </div>
                    <label className="section-label">Dislikes</label>
                    <textarea rows="5" cols="50" value={dislike} placeholder="e.g.,Mushrooms,Olives " onChange={(e)=>{setdislike(e.target.value)}}></textarea>
                    {error && <p className="err"> {error}</p>} 
                   </div>
                   
                </form>
                <div className="plan-but">
                    <button className="plan" onClick={handlesubmit}  disabled={loading} > {loading ? (
                        <div className="spinner"></div>
                    ) : (
                        "Generate plan →"
                    )}</button>
                    
                </div>
            </div>
         </div>
       </div>
       <div>
       </div>
        </>
    )
}
export default Home