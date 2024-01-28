import { useEffect, useState } from "react";

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null); // Track the user being edited
  const [editedUserData, setEditedUserData] = useState({
    name: "",
    email: "",
    id: "",
    courses: [],
    mobile: "",
  });

  useEffect(() => {
    // Fetch user data from your backend API or database when the component mounts
    fetchUserData();
  }, []); // The empty dependency array ensures the effect runs once after initial render

  console.log(editUser?._id);
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_IP}/users`);
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // delete a user by id
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_IP}/users/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("User deleted successfully");
        alert("User deleted successfully");
        fetchUserData(); // Refresh the user data after deletion
      } else {
        console.error("Failed to delete user");
        console.error(await response.text()); // Log any error message from the server
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const openEditModal = (user) => {
    console.log(user);
    // Function to open the edit modal and populate it with user data
    setEditUser(user);
    setEditedUserData({
      name: user.name,
      email: user.email,
      id: user.id,
      courses: user.courses,
      mobile: user.mobile,
    });
  };

  const closeEditModal = () => {
    // Function to close the edit modal
    setEditUser(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const updateUser = async () => {
    // Function to update user data
    try {
      const response = await fetch(
        `${import.meta.env.VITE_IP}/users/${editUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editedUserData.name,
            email: editedUserData.email,
            id: editedUserData.id,
            mobile: editedUserData.mobile,
            courses: editedUserData.courses
              .split(",")
              .map((course) => course.trim()),
          }),
        }
      );

      if (response.ok) {
        closeEditModal();
        fetchUserData(); // Refresh user data after updating
        alert("User updated successfully");
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // console.log(editUser.mobile)

  return (
    <div className="text-center">
      <h2 className="m-8 text-3xl font-bold">User Table</h2>
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Courses</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.mobile}</td>
                <td>{user.courses?.join(", ")}</td>
                <td>{user.category}</td>
                <td className="flex text-center">
                  <button
                    onClick={() => {
                      console.log("Edit button clicked. User: ", user);
                      openEditModal(user);
                    }}
                    className=" btn-sm bg-blue-600 rounded-lg text-white mx-6"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className=" btn-sm bg-red-600 rounded-lg text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editUser && (
        <div className="">
          {" "}
          {/* This div should be visible */}
          <div className="modal-content">
            <h3 className="text-xl bg-blue-700 text-white p-1 rounded-lg mb-6 ">
              Edit User
            </h3>
            <input
              type="text"
              name="name"
              value={editedUserData.name || ""}
              onChange={handleEditInputChange}
            />
            <input
              type="text"
              name="email"
              value={editedUserData.email || ""}
              onChange={handleEditInputChange}
            />
            <input
              type="text"
              name="id"
              placeholder="Enter id"
              value={editedUserData.id || ""}
              onChange={handleEditInputChange}
            />
            <input
              type="text"
              name="mobile"
              placeholder="Enter mobile"
              value={editUser.mobile || ""}
              onChange={handleEditInputChange}
            />
            <input
              type="text"
              name="courses"
              placeholder="Enter courses, separated by commas"
              value={editedUserData.courses || ""}
              onChange={handleEditInputChange}
            />
            <button
              className="bg-green-600 p-1 rounded-lg text-white mt-6 mr-6"
              onClick={updateUser}
            >
              Update
            </button>
            <button
              className="bg-red-600 p-1 rounded-lg text-white mt-6"
              onClick={closeEditModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
