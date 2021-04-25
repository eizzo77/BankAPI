import { useState, useEffect } from "react";
import axios from "axios";

export const App = () => {
  const [users, setUsers] = useState([]);
  const [addUserMsg, setAddUserMsg] = useState("");
  const [idInput, setIdInput] = useState("");

  useEffect(() => {
    const fetch = async () => {
      console.log("here");
      const usersData = await axios.get("api/users");
      console.log(usersData);
      setUsers(usersData.data);
    };
    fetch();
  }, []);

  const renderUsers = () => {
    return users.map((user) => {
      return (
        <div key={user.passportID}>
          <ul>
            <li>ID: {user.passportID}</li>
            <li>Cash: {user.cash}</li>
            <li>Credit: {user.credit}</li>
            <li>Activity: {user.isActive}</li>
          </ul>
        </div>
      );
    });
  };

  const onAddingUserClick = async () => {
    try {
      const users = await axios.post("/api/users/" + idInput);
      setUsers(users.data);
      setAddUserMsg("");
    } catch (error) {
      setAddUserMsg(error.message);
    }
  };

  return (
    <>
      <div>{renderUsers()}</div>
      <div>
        <h4>Add a new Bank User</h4>
        <div className="add-user-container">
          <label>Passport ID:</label>
          <input
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
            type="numbers"
          ></input>
          <button onClick={() => onAddingUserClick()}>Add User</button>
          {addUserMsg}
        </div>
      </div>
    </>
  );
};
