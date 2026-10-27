import { useDiet } from "./dietContext"
import { Link } from "react-router-dom"
import "./exercise.css"
function Exercise(){
    const [diet]=useDiet()
     if (!diet) return <p>No diet data found.</p>;
return(
    <div className="exercise-bg">
        <div className="name">
            <h2>Your Exercise Plan</h2>
             <p>Customized workout routine for your goals</p>
             <div>
                
            </div>
        </div>
       <div className="exe">
        {diet && (
        diet.exercisePlan.map((item,index)=>(
            <ul key={index} className="list-diet">
                <li>
                    <div className="exercise-cont">
                        <h3>{item.exerciseName}</h3>
                        <p className="muscle">Focused on <strong>{item.muscleFocus}</strong></p>
                        <div className="workout">
                            <p className="set"><strong>Sets</strong>: {item.sets}</p>
                            <p className="rep"><strong>Reps</strong>:{item.reps}</p>
                        </div>
                        <p className="video"><Link to={item.videoUrl}>▶️ Watch Tutorial</Link></p>
                    </div>
                </li>
            </ul>
        ))
       )}
       </div>
    </div>
)
}
export default Exercise