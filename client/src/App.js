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
        <div key={user._id}>
          <ul>
            <li>ID: {user._id}</li>
            <li>Name: {user.name}</li>
            <li>Cash: {user.cash}</li>
            <li>Credit: {user.credit}</li>
            <li>
              Activity:{" "}
              <label style={{ color: user.isActive ? "green" : "red" }}>
                {" "}
                {user.isActive.toString()}
              </label>
            </li>
          </ul>
        </div>
      );
    });
  };

  // const onFetchUsersClick = async () => {
  //   try {
  //     const usersData = await axios.get("api/users");
  //     setUsers(usersData.data);
  //   } catch (error) {}
  // };

  const onAddingUserClick = async () => {
    try {
      const newUser = { passportID: idInput, name: "BLAMES" };
      const updatedUser = await axios.post("/api/users", newUser);
      const newUsers = [...users, updatedUser];
      setUsers(newUsers);
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
          {/* <button onClick={() => onFetchUsersClick()}>Get Users</button> */}
          {addUserMsg}
        </div>
      </div>
      {console.log(users)}
    </>
  );
};
