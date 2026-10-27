import { createContext,useContext,useState,useEffect } from "react";
import Cookies from "js-cookie";
const Dietcontext=createContext()
export const DietProvider=({children})=>{
    const [diet,setdiet]=useState(null)

    useEffect(() => {
      const fetchDiet = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3000/my-plan", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setdiet(data);
        } else {
          console.error("Unable to fetch plan");
        }
      } catch (err) {
        console.error("Error while fetching diet:", err);
      }
    };

    fetchDiet();
  }, [diet]);
  // console.log(diet)
  
    return(
    <Dietcontext.Provider value={[diet,setdiet]}>
        {children}
    </Dietcontext.Provider>
)
}
export const useDiet=()=> useContext(Dietcontext)
