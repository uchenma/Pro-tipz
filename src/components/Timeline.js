import React, { useState, useEffect } from "react";

function Timeline() {
  const [goals, setGoals] = useState([]);
  const [newRec, setNewRec] = useState("");
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/timeline", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          setGoals(responseJson.goals);
        }
      })
      .catch(err => console.log(err));
  }, []);

  function addNewGoal(e) {
    e.preventDefault();
    // setNewGoal(e.target.value);
    // console.log(newGoal);
    if (e.key === "Enter") {
      fetch("http://localhost:4000/newgoal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          newGoal
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.success) {
            setGoals(responseJson.goals);
          }
        })
        .catch(err => console.log(err));
    }
  }

  return (
    <div>
      <textarea
        name="newGoal"
        value={newGoal}
        placeholder="Add my own goal"
        onChange={e => setNewGoal(e.target.value)}
        // onKeyPress={e => addNewGoal(e)}
      />
      <input type="submit" value="Add" onClick={e => addNewGoal(e)} />
      <h2> All Goals</h2>
      <ul>
        {goals.map(goal => {
          return (
            <div
              className="goalContainer"
              style={{ display: "flex", flexDirection: "row" }}
            >
              <div className="user" style={{ flexDirection: "column" }}>
                {/* Div with user info */}
                {goal.user.profilePic}
                <h4>Goal by user: {goals.user._id}</h4>
              </div>
              <div style={{ flexDirection: "column" }}>
                {/* Div with goal info */}
                <p>{goal.content}</p>
                <p>{goal.recs}</p>
                <textarea
                  name="newRec"
                  value={newRec}
                  placeholder="Make a recommendation!"
                  onChange={e => setNewRec(e.target.value)}
                />
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export default Timeline;