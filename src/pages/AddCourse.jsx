import { useEffect, useState } from "react";

const AddCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [courses, setCourses] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleAddCourse = (event) => {
    event.preventDefault();

    fetch(`${import.meta.env.VITE_IP}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseName }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          console.log(data.message);
          alert("course added successfully");
        } else if (data.error) {
          console.error(data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    fetch(`${import.meta.env.VITE_IP}/courses`)
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Error:", error));
  }, [handleAddCourse]);
  return (
    <div className="">
      {/* <h1 className="text-center mt-10 text-4xl">Hi Admin</h1> */}
      <h1 className="text-center mt-10 text-2xl underline mb-6">
        Previous Courses
      </h1>
      <div className="text-center">
        <ol className="grid grid-cols-6 gap-2 text-center font-semibold justify-center w-[60%] mx-auto">
          {courses[0]?.courses?.map((course, index) => (
            <li key={index + 1}>{`${index + 1}. ${course}`}</li>
          ))}
        </ol>
      </div>
      <h1 className="text-center mt-16 text-2xl underline mb-6">Add Course</h1>
      <div className="text-center">
        <input
          type="text"
          placeholder="Enter Course Name"
          className="border-2 border-gray-500 p-2 rounded-lg"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 p-2 rounded-lg text-white ml-2"
          onClick={handleAddCourse}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddCourse;
