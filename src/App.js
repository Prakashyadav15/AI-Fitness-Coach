import Apperance from "./component/AI fitness/front";
import Reg from "./component/AI fitness/reg";
import Login from "./component/AI fitness/log";
import Layout from "./component/AI fitness/layout";
import Home from "./component/AI fitness/home";
import Diet from "./component/AI fitness/diet";
import Exercise from "./component/AI fitness/exercise";
import { DietProvider } from "./component/AI fitness/dietContext";
// import Notifications from "./component/AI fitness/reminder";
import { BrowserRouter,Route,Routes} from "react-router-dom";
function App() {
  return (
  <BrowserRouter>
    <DietProvider>   
    <Routes>
        <Route path="/" element={<Apperance/>}/>
        <Route path="/log" element={<Login/>}/>
        <Route path="/reg" element={<Reg/>}/>
         
        <Route element={<Layout/>} >
         
           <Route path="/home" element={<Home/>}/>
          <Route path="/diet" element={<Diet/>}/>
          <Route path="/exercise" element={<Exercise/>}/>
          {/* <Route path="/notify" element={<Notifications/>}/> */}
        
        </Route>
        
      </Routes>
    </DietProvider>
  </BrowserRouter>
  );
}

export default App;
