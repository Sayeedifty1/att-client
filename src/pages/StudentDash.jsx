import { useUser } from "../Provider/UserProvider";
import { useState, useEffect } from 'react';

const StudentDash = () => {
    const { user } = useUser();
    const userID = user?.id;
    console.log(userID)

    const [studentData, setStudentData] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_IP}/get-student-att-data/${userID}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setStudentData(data);
                } else {
                    console.error('Error: expected array but received', data);
                }
            })
            .catch(error => console.error('Error:', error));
    }, [userID]);

    return (
        <div className="w-[80%] mx-auto mt-10">
           
            <h1 className="text-4xl text-center mb-6">Student Dashboard</h1>

            <hr />
            <p className="text-xl pt-1 mt-10">Name:{user?.name}</p>
            <p className="text-xl pt-1">ID:{user?.id}</p>
            <p className="text-xl pt-1">Email:{user?.email}</p>
            <p className="text-xl pt-1 mb-6">Mobile:{user?.mobile}</p>
            <hr />
            <div>
            <p className="text-2xl mt-10 text-center">All Your Attendance is given below</p>
                {studentData && studentData.map((data, index) => (
                    <div key={index}>
                      

                        <table className="table-auto my-10 mx-auto w-full text-center">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border">Course Name</th>
                                    <th className="px-4 py-2 border">Total Classes</th>
                                    <th className="px-4 py-2 border">Total Present Days</th>
                                    <th className="px-4 py-2 border">Percentage</th>
                                    <th className="px-4 py-2 border">Total Marks</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border px-4 py-2">{data.courseName}</td>
                                    <td className="border px-4 py-2">{data.totalClasses}</td>
                                    <td className="border px-4 py-2">{data.totalPresentDays}</td>
                                    <td className="border px-4 py-2">{data.percentage}</td>
                                    <td className="border px-4 py-2">{data.totalMarks}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentDash;