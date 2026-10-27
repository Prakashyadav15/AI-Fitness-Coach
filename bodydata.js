const sqlite=require('sqlite')
const sqlite3=require('sqlite3')
const express=require('express')
const {open}=require("sqlite")
const path = require('path');
const cors=require('cors')
const jwt=require('jsonwebtoken')
const JWT_SECRET = "mysecretkey"; 
const app=express();
const dbpath=path.join(__dirname,"fitness.db")
app.use(express.json())
let db=null

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { google } = require("googleapis");
require("dotenv").config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
})

const initialise=async()=>{
    try{
        db=await open({
            filename:dbpath,
            driver:sqlite3.Database
        })
        app.listen(3000, () => {
            console.log("Server is running at http://localhost:3000/");
        });
    }
    catch(er){
        console.log("error at initalise",er)
        process.exit(1)
    }
}
initialise()

app.use(cors({
    origin:['http://localhost:3001'],
    credentials:true
}))

app.post("/reg",async(req,res)=>{
    const{name,email,password}=req.body
    const checkuser=`SELECT * FROM user_table WHERE name=?`
    const getuser=await db.get(checkuser,[name])
    if(getuser===undefined){
        const posting=`INSERT INTO user_table
       (name,email,password)
       values(?,?,?)`
    const postdetails=await db.run(posting,[name,email,password])
    res.send(postdetails)
    console.log(postdetails)
    }
    else{
        res.json({message:"user name exists"})
    }
    
})

app.post("/log",async(req,res)=>{
    const{name,password}=req.body
    try{
        const checklog=`SELECT * FROM user_table WHERE name=?`
        const user=await db.get(checklog,[name])
        if (!user || user.password !==password){  // if user is not their or user password also not same
        return res.send("invalid credentails")
        }
        const token=jwt.sign({id:user.id,name:user.name},JWT_SECRET,{expiresIn:"7d"} )
        res.json({ message: "Login successful","token":token ,user});

    } 
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server error during login" });
  }
})

function auth(req,res,next){
    const authheader=req.headers["authorization"]
    const token =authheader && authheader.split(" ")[1];
      if(!token){
       return res.status(401).json({auth:false,message:"missing token"})
      }
       jwt.verify(token,JWT_SECRET,(err ,decoded)=>{
          if(err){
             return res.status(401).json({auth:false,message:"invalid token"})
          }
        req.user=decoded;
        req.id=decoded.id
        next()
      })
        
}

app.get('/verify',auth,(req,res)=>{
      return res.status(200).json({auth:true,id:req.id,user:req.user})
})
app.delete("/delete/:user_id",async(req,res)=>{
    const {user_id}=req.params
    const query=`DELETE FROM personal_details WHERE user_id="${user_id}"`
    const delet= await db.run(query)
    res.send("deleted")
})

app.post("/details",auth,async(req,res)=>{
  try{
        const {height,weight,gender,goals,type,dislike,time,age}=req.body
        const userid=req.id

        const existingDetails = await db.get(
            "SELECT id FROM personal_details WHERE user_id = ?",
            [userid]
        );

        if (existingDetails) {
            // 2. If they exist, UPDATE the existing row
            console.log("Updating existing details for user:", userid);
            const updateQuery = `
                UPDATE personal_details SET
                    height = ?,
                    weight = ?,
                    gender = ?,
                    goal = ?,
                    diet_type = ?,
                    dislikes = ?,
                    reminder_time = ?,
                    age = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?`;
            await db.run(updateQuery, [height, weight, gender, goals, type, dislike, time, age, userid]);

        } else {
            // 3. If they do NOT exist, INSERT a new row
            console.log("Inserting new details for user:", userid);
            const insertQuery = `
                INSERT INTO personal_details (user_id, height, weight, gender, goal, diet_type, dislikes, reminder_time, age)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            await db.run(insertQuery, [userid, height, weight, gender, goals, type, dislike, time, age]);
        }

        res.status(200).json({ message: "Personal details saved successfully!" });

    } catch (err) {
        console.error("Error inserting/updating personal details:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


function generateMasterPrompt(details) {
  // Uses the data fetched from your 'personal_details' table
  return `
    ROLE: You are an expert AI Fitness & Nutrition Coach.
    GOAL: Generate a complete, customized daily plan based on the user's data.

    USER DATA:
    * Age: ${details.age || 'not provided'}
    * Gender: ${details.gender}
    * Height: ${details.height} cm
    * Weight: ${details.weight} kg
    * Goal: ${details.goal}
    * Dietary Preference: ${details.diet_type}
    * Food Dislikes: ${details.dislikes}

    INSTRUCTIONS:
    1. Create a diet plan for three meals (breakfast, lunch, dinner).
    2. Provide a simple, short recipe for each meal.
    3. Provide the estimated calories for each meal and a total for the day.
    4. Provide a daily cost estimate tag ('low', 'medium', or 'high').
    5. Create a workout plan listing specific exercises, sets, and reps.
    6. For each exercise, provide a "youtubeSearchQuery" string. This is critical for finding a real video.

    IMPORTANT: Return your entire response as a single, valid JSON object. Do not write any text or explanations outside of the JSON block.

    JSON FORMAT:
    {
      "dailyCostEstimate": "low",
      "totalCalories": 2000,
      "meals": [
        {
          "name": "Breakfast",
          "meal": "Oatmeal with Berries",
          "calories": 400,
          "recipe": "Mix 1/2 cup oats with 1 cup water. Microwave for 2 minutes. Top with 1/2 cup mixed berries."
        }
      ],
      "exercisePlan": [
        {
          "exerciseName": "Dumbbell Squat",
          "sets": 3,
          "reps": 12,
          "youtubeSearchQuery": "how to do dumbbell squat correctly"
        }
      ]
    }
  `;
}

async function getYouTubeVideo(searchQuery) {
  try {
    const response = await youtube.search.list({
      part: 'snippet',
      q: searchQuery,
      type: 'video',
      maxResults: 1,
    });

    const video = response.data.items[0];
    if (video) {
      return `https://www.youtube.com/watch?v=${video.id.videoId}`;
    }
    return "https://www.youtube.com"; // Fallback
  } catch (err) {
    console.error("YouTube API Error:", err.message);
    return "https://www.youtube.com/results?search_query=" + searchQuery; // Fallback search link
  }
}


app.post("/generate-plan", auth, async (req, res) => {
  const userId = req.id;
  // 1. Initialize a flag to track the transaction
  let transactionStarted = false;

  try {
    // 1. Get user's personal details from DB
    const details = await db.get("SELECT * FROM personal_details WHERE user_id = ?", [userId]);
    if (!details) {
      return res.status(404).json({ message: "Please save your personal details first." });
    }

    // 2. Create the master prompt
    const prompt = generateMasterPrompt(details);
    console.log("--- TEST: ATTEMPTING TO CALL GEMINI V1 API ---");
    
  // 3. Call the Gemini AI API
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        apiVersion: "v1" // This forces it to use the stable v1 API
    });    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let planText = await response.text();
    
    // Clean up the response
    planText = planText.replace(/```json/g, "").replace(/```/g, "");

    // 4. Parse the AI's JSON response
    let planData;
    try {
      planData = JSON.parse(planText);
    } catch (parseError) {
      console.error("AI JSON Parse Error:", parseError, "Raw text:", planText);
      return res.status(500).json({ message: "Error parsing AI response" });
    }

    // 5. Enrich the plan with YouTube links
    for (const exercise of planData.exercisePlan) {
      const videoUrl = await getYouTubeVideo(exercise.youtubeSearchQuery);
      exercise.videoUrl = videoUrl; // Add the new videoUrl property
    }

    // 6. --- NEW DATABASE LOGIC ---
    await db.run("BEGIN TRANSACTION");
    // 2. Set the flag to true now that the transaction has started
    transactionStarted = true; 

    // 6a. Insert into the "parent" daily_plan table
    const planInsertResult = await db.run(
      "INSERT INTO daily_plan (user_id, daily_calories_goal, daily_cost_estimate) VALUES (?, ?, ?)",
      [userId, planData.totalCalories, planData.dailyCostEstimate]
    );
    const dailyPlanId = planInsertResult.lastID; // Get the ID of the new plan

    // 6b. Insert all meals into the meal_plan table
    for (const meal of planData.meals) {
      await db.run(
        "INSERT INTO meal_plan (daily_plan_id, meal_name, meal_description, calories, recipe) VALUES (?, ?, ?, ?, ?)",
        [dailyPlanId, meal.name, meal.meal, meal.calories, meal.recipe]
      );
    }

    // 6c. Insert all exercises into the exercise_plan table
    for (const exercise of planData.exercisePlan) {
      await db.run(
        "INSERT INTO exercise_plan (daily_plan_id, exercise_name, sets, reps, youtube_search_query, youtube_url) VALUES (?, ?, ?, ?, ?, ?)",
        [dailyPlanId, exercise.exerciseName, exercise.sets, exercise.reps, exercise.youtubeSearchQuery, exercise.videoUrl]
      );
    }

    // Commit the transaction
    await db.run("COMMIT");

    // 7. Send the complete plan to the React frontend
    res.json(planData);

  } catch (err) {
    // 3. Check the flag before rolling back
    if (transactionStarted) {
      await db.run("ROLLBACK");
    }
    console.error("Error in /generate-plan:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}); 


// --- ⚠️ UPDATED ENDPOINT 2: /my-plan ---
app.get("/my-plan", auth, async (req, res) => {
  const userId = req.id;
  try {
    // 1. Find the most recent "parent" plan for this user
    const dailyPlan = await db.get(
      "SELECT * FROM daily_plan WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [userId]
    );
    
    if (!dailyPlan) {
      return res.status(404).json({ message: "No plan found. Please generate one first." });
    }

    // 2. Get all "child" meals for that plan
    const meals = await db.all(
      "SELECT meal_name AS name, meal_description AS meal, calories, recipe FROM meal_plan WHERE daily_plan_id = ?",
      [dailyPlan.id]
    );

    // 3. Get all "child" exercises for that plan
    const exercises = await db.all(
      "SELECT exercise_name AS exerciseName, sets, reps, youtube_search_query AS youtubeSearchQuery, youtube_url AS videoUrl FROM exercise_plan WHERE daily_plan_id = ?",
      [dailyPlan.id]
    );

    // 4. Reconstruct the final JSON object, just like the AI made
    const fullPlan = {
      dailyCostEstimate: dailyPlan.daily_cost_estimate,
      totalCalories: dailyPlan.daily_calories_goal,
      meals: meals,
      exercisePlan: exercises
    };

    res.json(fullPlan);

  } catch (err) {
    console.error("Error in /my-plan:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// --- END UPDATED ENDPOINT 2 ---