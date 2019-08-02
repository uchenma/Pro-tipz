import React, { useState, useEffect } from "react";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }, 
      credentials: "include"
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          console.log(responseJson);
          setProfile(responseJson.data);
          setGoals(responseJson.goals)
        }
      })
      .catch(err => console.log(err));
  }, []);

  function toggleGoal(goalId,i){
    fetch("http://localhost:4000/togglegoal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }, 
      credentials: "include",
      redirect: "follow",
      body: JSON.stringify({
        goalId
      })
    })
    .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          console.log(responseJson);
          if(responseJson.success){
            const modifiedGoal = goals;
            modifiedGoal[i] = responseJson.data
            setGoals(modifiedGoal)
          }
        }
      })
      .catch(err => console.log(err));
  }

  return (
    <div className="profile">
      {profile && 
      <div> 
      <h1>Your Profile!</h1>
      <img src={profile.profilePic} />
      <h3>
        Name: {profile.firstName} {profile.lastName}
      </h3>
      <p>Age: {profile.age}</p>
      <p>Gender: {profile.gender}</p>
      <p>Bio: {profile.bio}</p>
      <p>Email: {profile.email}</p>
      <h4>My Goals:</h4>
      {goals.map((goal,i) => 
      <div>
        <a href="#" onClick={() => toggleGoal(goal._id,i)}> {goal.isCompleted? <em className="strike">{goal.content}</em>: goal.content} 
        </a>
      </div>
        
      )}
      </div>
    }
    </div>
  );
}

export default Profile;
