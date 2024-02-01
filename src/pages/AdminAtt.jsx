import { useEffect, useState } from "react";
// import { useUser } from "../Provider/UserProvider";

const AdminAtt = () => {
  const [courseName, setCourseName] = useState("");
  const [teacherDetails, setTeacherDetails] = useState([]);
  const [courses, setCourses] = useState([]);

  const handleSelectChange = (event) => {
    setCourseName(event.target.value);
  };
  console.log(teacherDetails, courseName);
  // const teacherId = user?.fingerprint;
  // const courseName = "VLSI"; // You can dynamically set this value based on your logic
  console.log(courseName);
  const [studentsData, setStudentsData] = useState([]);
  const [attendanceData, setAttendanceData] = useState({
    matchedData: [],
    uniqueCourses: [],
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_IP}/courses`)
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_IP}/attendance/${courseName}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }

        const data = await response.json();
        setAttendanceData(data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    // fetch student bt course name
    const fetchStudentsByCourse = async (courseName) => {
      setStudentsData([]);
      console.log(courseName);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_IP}/students-by-course`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ courseName }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const students = await response.json();
        setStudentsData(students); // Assuming you have a state variable to hold the students data
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    setAttendanceData({ matchedData: [], uniqueCourses: [] }); // Reset attendance data when course name changes
    fetchAttendanceData();
    fetchStudentsByCourse(courseName);
  }, [courseName]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_IP}/users`)
      .then((response) => response.json())
      .then((data) => {
        const teachers = data.filter((user) => user.category === "Teacher");
        const matchedTeachers = teachers.filter((teacher) =>
          teacher.courses.includes(courseName)
        );
        setTeacherDetails(matchedTeachers);
      });
  }, [courseName]);

  return (
    <div className="w-[80%] mx-auto overflow-x-auto">
      <h1 className="text-5xl my-10">Attendance </h1>
      {/* <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
            <p>Profession:{user?.category}</p>
            <p>Mobile:{user?.mobile}</p>
            <p>Taken Course: {user?.courses.length}</p> */}
      {teacherDetails.map((teacher, index) => (
        <div key={index}>
          <p>Name: {teacher.name}</p>
          <p>Email: {teacher.email}</p>
          <p>Profession: {teacher.category}</p>
          <p>Mobile: {teacher.mobile}</p>
          {/* <p>Taken Course: {teacher.courses.length}</p> */}
        </div>
      ))}

      <div className="flex gap-2 mt-1">
        <p>Select a Course to see attendance</p>
        <select value={courseName} onChange={handleSelectChange}>
          <option value="">Select a course</option>
          {courses[0].courses.map((course) => (
            <option value={course} key={course._id}>
              {course}
            </option>
          ))}
        </select>
      </div>
      {/* Iterate over each course */}
      {attendanceData.matchedData.length === 0 ? (
        <p>No data in the server</p>
      ) : (
        attendanceData.uniqueCourses.map((course, index) => (
          <>
            <table
              key={index}
              className="w-4/5 text-center border border-collapse border-gray-400"
            >
              <caption>Attendance for {course} course</caption>
              <thead>
                <tr>
                  <th className="border">Name</th>
                  <th className="border">Id</th>
                  {/* Iterate over the unique dates in the attendance data for the current course */}
                  {attendanceData.matchedData.map((data) => (
                    <th className="border" key={data.Date}>
                      {data.Date}
                    </th>
                  ))}
                  <th className="border">Total Present Days</th>
                  <th className="border">Percentage</th>
                  <th className="border">Total marks</th>
                </tr>
              </thead>
              <tbody>
                {studentsData?.map((student) => {
                  const dates = Array.from(
                    new Set(
                      attendanceData.matchedData
                        .filter((data) => data.course === course)
                        .map((data) => data.Date)
                    )
                  );
                  const presentDays = dates.filter((date) =>
                    attendanceData.matchedData.find(
                      (data) =>
                        data.Date === date &&
                        Object.values(data).includes(student.fingerprint)
                    )
                  ).length;
                  const percentage = (presentDays / dates.length) * 100;
                  return (
                    <tr key={student?.id}>
                      <td className="border">{student?.name}</td>
                      <td className="border">{student?.id}</td>
                      {/* Iterate over the unique dates in the attendance data for the current course */}
                      {dates.map((date) => (
                        <td className="border" key={date}>
                          {attendanceData.matchedData.find(
                            (data) =>
                              data.Date === date &&
                              Object.values(data).includes(student.fingerprint)
                          )
                            ? "P"
                            : "A"}
                        </td>
                      ))}
                      <td className="border">{presentDays}</td>
                      <td className="border">{percentage.toFixed(1)}%</td>
                      <td className="border">{percentage / 10}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        ))
      )}
    </div>
  );
};

export default AdminAtt;
