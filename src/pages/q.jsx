/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useUser } from "../Provider/UserProvider";

export const TeacherDash = () => {
  const { user } = useUser();
  const [courseName, setCourseName] = useState(user?.courses[0]);
  const teacherId = user?.fingerprint;
  const [studentsData, setStudentsData] = useState([]);
  const [attendanceData, setAttendanceData] = useState({
    matchedData: [],
    uniqueCourses: [],
  });
  const [attendanceInfo, setAttendanceInfo] = useState([]);

  const deleteAttendanceData = async (courseName) => {
    console.log("courseName", courseName);
    try {
      const response = await fetch(`http://localhost:3000/attendance/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseName }), // Changed 'course' to 'courseName'
      });

      if (!response.ok) {
        throw new Error("Failed to delete attendance data");
      }

      const result = await response.json();
      console.log(result.message); // Log the success message
    } catch (error) {
      console.error("Error deleting attendance data:", error);
    }
  };

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
        return data; // Return the data
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    // fetch student bt course name
    const fetchStudentsByCourse = async (courseName) => {
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

    if (teacherId) {
      setAttendanceData({ matchedData: [], uniqueCourses: [] });
      fetchAttendanceData();
      fetchStudentsByCourse(courseName);
    }
  }, [courseName, teacherId]);

  useEffect(() => {
    const calculateAttendanceInfo = () => {
      const info = studentsData.map((student) => {
        const dates = Array.from(
          new Set(
            attendanceData.matchedData
              .filter((data) => data.course === courseName)
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
        const percentage =
          dates.length > 0 ? (presentDays / dates.length) * 100 : 0;
        return {
          courseName,
          name: student.name,
          id: student.id,
          totalClasses: dates.length,
          totalPresentDays: presentDays,
          percentage: percentage.toFixed(1),
          totalMarks: percentage / 10,
        };
      });
      console.log(info);
      setAttendanceInfo(info);
    };

    calculateAttendanceInfo();
  }, [attendanceData.matchedData, courseName, studentsData]);
  console.log("hello", attendanceInfo);
  const sendAttendanceDataToServer = async (attendanceInfo) => {
    try {
      await deleteAttendanceData(attendanceInfo[0].courseName);
      const response = await fetch(`http://localhost:3000/student-att-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attendanceInfo),
      });

      if (!response.ok) {
        throw new Error("Failed to send attendance data to the server");
      }

      const result = await response.json();
      console.log(result); // Log the result from the server
    } catch (error) {
      console.error("Error sending attendance data to the server:", error);
    }
  };
  useEffect(() => {
    sendAttendanceDataToServer(attendanceInfo);
  }, [attendanceInfo, sendAttendanceDataToServer]);

  return (
    <div className="w-[80%] mx-auto overflow-x-auto">
      <h1 className="text-5xl my-10">Attendance </h1>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Profession:{user?.category}</p>
      <p>Mobile:{user?.mobile}</p>
      <p>Taken Course: {user?.courses.length}</p>
      <div className="flex gap-2 mt-1">
        <p>Select Course: </p>
        <select
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        >
          {user?.courses.map((course, index) => (
            <option key={index} value={course}>
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
export default TeacherDash;
