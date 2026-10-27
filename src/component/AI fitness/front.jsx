import "./front.css"
import { useNavigate } from "react-router-dom"
import Notifications from "./reminder"
function Apperance(){
    const features=[
        {
        "image":"photos/apple.png",
        "feature":"Custom Diet Plans",
        "disc":"Personalized meal plans with recipes,macros,and costs tailored to your goals and preferences"
        },
        {
        "image":"photos/workout.png",
        "feature":"Smart Workouts",
        "disc":"AI-designed execrise routines with sets, reps, and video tutorials for perfect form"
        }
        ,{
        "image":"photos/guide.png",
        "feature":"Expert Guidance",
        "disc":"Science-backed recommendations that adapt to your progree and keep you motivated"
        }
    ]
    const navigation=useNavigate()
    const handlenavigate=()=>{
        navigation("/home")
    }
    return(
        <div className="big-bg">
            <Notifications/>
            <div className="pic">
                <h1>Your AI Fitness &<br/> Nutrition Coach</h1>
                <p>Get personalized diet plans, exercise routines, and expert guidance powered by advanced AI</p>
                <button onClick={handlenavigate}>start your journey</button>
            </div>
            <div className="features">
                <ul className="list">
                    {features.map((li,id)=>(
                        <li key={id} className="data">
                            <img src={li.image} alt="img"/>
                            <h3>{li.feature}</h3>
                            <p>{li.disc}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
export default Apperance