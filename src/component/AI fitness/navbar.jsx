import { Link,useNavigate } from "react-router-dom"
import "./home.css"
import Cookies from "js-cookie"

function Navbar(){
    const navigate=useNavigate()
   
    const logout=()=>{
        Cookies.remove("token");
         navigate("/log");
    }
    
    return(
        <nav className="navbar">
        <div>
        </div>
        <p className="theme-toggle"><Link to="/home"  >Home</Link></p>
        <p className="theme-toggle"><Link to="/diet" > Diet</Link></p>
        <p className="theme-toggle"><Link to="/exercise" >Exercise</Link></p>
        {/* <p className="theme-toggle"><Link to="/notify"  >Reminder</Link></p>         */}
        <p className="theme-toggle" onClick={logout}>Logout</p>        

       
       
    </nav>
    )
}
export default Navbar