import { useState } from "react"
import "./diet.css"
import { useDiet } from "./dietContext"
function Diet(){
    const[diet]=useDiet()
    const[viewrecipe,setviewrecipe]=useState(null)
    
    const toggleview=(index)=>{
        setviewrecipe(viewrecipe===index?null:index)
    }
   
       
    return(
        <div className="diet-bg">
            <div className="heading-cal">
                <div className="head">
                    <h3>Your Daily Diet Plan</h3>
                    <p>Personalized nutrition to reach your goals</p>
                </div>
                
                   {diet && (
                        <div className="cal" >
                        <p >Total</p>
                        <h3 className="calories"><strong>{diet.totalCalories}</strong> cal</h3>
                        <p >Est.cost:<strong> ₹{diet.dailyCostEstimate}</strong></p>
                        
                        </div>
                   )} 
                
            </div>

            <div className="cont">
                {diet&&(
                diet.meals.map((item,index)=>(
                    <ul key={index}  className="list-diet" >
                        <li >
                           <div className="food">
                            <h3 >{item.name}</h3>
                                <div className="recipe-name">
                                    <div className="item-cost">
                                        <h4>{item.recipe_name}</h4>
                                        <p>Est Cost : ₹{item.cost}</p>
                                    </div>
                                    <div className="diet-cal">
                                        <p>{item.calories} cal</p>
                                    </div>
                                </div>
                                <div className="grams">
                                    <p className="protein"><strong>Protein</strong>: {item.protein_grams}g</p>
                                    <p className="fat"><strong>Fats</strong>: {item.fats_grams}g</p>
                                    <p className="carb"><strong>Carbs</strong>: {item.carbs_grams}g</p>
                                </div>
                                <div>
                                    <div onClick={()=>toggleview(index)} className="view">
                                        <h5>View Recipe</h5>
                                        <p >{viewrecipe===index?" ⏶ ":" ⏷"}</p>
                                        
                                    </div>
                                    {/* {viewrecipe===index?"":<div className="separator"></div>} */}
                                    {viewrecipe === index &&(<p className="recipe">{item.recipe}</p>)}   
                                </div>

                            </div>
                        </li>
                    </ul>)))}
            </div>
            
        </div>
    )
}
export default Diet