import { Outlet } from "react-router-dom"
import Navbar from "./navbar";
function Layout(){
    return(
        <div>
        <Navbar/>
        <div>
            <Outlet/>
        </div>
        </div>
    )
}
export default Layout