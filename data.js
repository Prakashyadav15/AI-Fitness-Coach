const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('fitness.db');

db.serialize(() => {

  // 1️⃣ User Table
  db.run(`
    CREATE TABLE IF NOT EXISTS user_table (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(200),
      email VARCHAR(200) UNIQUE,
      password VARCHAR(200),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2️⃣ Personal Details Table
  db.run(`
    CREATE TABLE IF NOT EXISTS personal_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      gender VARCHAR(200),
      height INTEGER,
      weight INTEGER,
      goal VARCHAR(200),
      diet_type VARCHAR(200),
      dislikes TEXT,
      reminder_time TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES user_table(id) ON DELETE CASCADE
    )
  `);



  // 3️⃣ AI Plans Table
db.serialize(() => {
  // ... (user_table and personal_details are the same) ...
  
  // 1. (OLD) Drop the old ai_plans table if it exists
  db.run(`DROP TABLE IF EXISTS ai_plans`);

  // 2. (NEW) The main "parent" plan table
  db.run(`
    CREATE TABLE IF NOT EXISTS daily_plan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      daily_calories_goal INTEGER,
      daily_cost_estimate VARCHAR(50),
      plan_date DATE DEFAULT (date('now')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES user_table(id) ON DELETE CASCADE
    )
  `);

  // 3. (NEW) The "child" table for meals, linked to the daily_plan
  db.run(`
    CREATE TABLE IF NOT EXISTS meal_plan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      daily_plan_id INTEGER,
      meal_name VARCHAR(100),
      meal_description TEXT,
      calories INTEGER,
      recipe TEXT,
      FOREIGN KEY(daily_plan_id) REFERENCES daily_plan(id) ON DELETE CASCADE
    )
  `);

  // 4. (NEW) The "child" table for exercises, linked to the daily_plan
  db.run(`
    CREATE TABLE IF NOT EXISTS exercise_plan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      daily_plan_id INTEGER,
      exercise_name VARCHAR(255),
      sets VARCHAR(50),
      reps VARCHAR(50),
      youtube_search_query TEXT,
      youtube_url TEXT,
      FOREIGN KEY(daily_plan_id) REFERENCES daily_plan(id) ON DELETE CASCADE
    )
  `);

});

});

db.close();
