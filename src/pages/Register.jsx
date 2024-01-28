import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { IoFingerPrintOutline } from "react-icons/io5";
import logo from "../assets/logo.jpeg";

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  // const [data, setData] = useState("");
  const [setSelectedCategory] = useState("");
  const [courses, setCourses] = useState([]);

  const [print, setPrint] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]); // Track selected courses
  const getPrint = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_IP}/newReg`);
      if (response.ok) {
        const data = await response.json();
        setPrint(data[0].newPrint);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetch(`${import.meta.env.VITE_IP}/courses`)
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getPrint();
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  // Function to delete the newPrint data
  const deletePrint = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_IP}/newReg`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPrint(false); // Update the print state to indicate deletion
      } else {
        console.error("Failed to delete newPrint data");
      }
    } catch (error) {
      console.error("Error in deletePrint:", error);
    }
  };

  // Function for post data to the db
  const handleCourseChange = (course, isChecked) => {
    setSelectedCourses((prevCourses) => {
      const updatedCourses = { ...prevCourses };
      if (isChecked) {
        updatedCourses[course] = course;
      } else {
        delete updatedCourses[course];
      }
      return updatedCourses;
    });
  };
  const availableCourse = courses?.[0]?.courses;
  const onSubmit = async (formData) => {
    try {
      // Check if the form is valid
      if (Object.keys(errors).length === 0) {
        // Include newPrint and formatted courses in formData
        formData.fingerprint = print;

        formData.courses = Object.keys(selectedCourses);

        console.log(formData);
        alert(
          "Registration successful. You can now log in with your new account."
        );
        reset(); // Reset the form
        deletePrint(); // Delete the newPrint data

        const response = await fetch(`${import.meta.env.VITE_IP}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert(
            "Registration successful. You can now log in with your new account."
          );
        } else {
          console.error("Failed to save user");
        }
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };

  return (
    <div className=" mx-auto flex justify-center pt-10 h-screen">
      <div className="md:w-2/6  bg-gray-100 rounded-lg shadow-xl p-6 bg-opacity-20">
        <div className="flex justify-center">
          <img src={logo} alt="logo" className="w-40 h-30 mb-10" />
        </div>

        <h3 className="text-2xl font-semibold mb-4">Please Register</h3>
        <form
          className="mx-auto form-control"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            {...register("name", { required: true })}
            placeholder="Enter Name"
            className={`border border-black p-1 rounded mb-4 ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && <p className="text-red-500">Name is required</p>}

          <input
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            placeholder="Enter email"
            className={`border border-black p-1 rounded mb-4 ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500">Valid email is required</p>
          )}
          <input
            {...register("mobile", { required: true })}
            placeholder="Enter Mobile Number"
            className={`border border-black p-1 rounded mb-4 ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.mobile && (
            <p className="text-red-500">Mobile Number is required</p>
          )}
          <input
            {...register("id", { required: true })}
            placeholder="Enter ID"
            className={`border border-black p-1 rounded mb-4 ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.id && <p className="text-red-500">ID is required</p>}

          <select
            className={`border border-black p-1 rounded mb-4 ${
              errors.category ? "border-red-500" : ""
            }`}
            {...register("category", { required: true })}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category...</option>
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
          </select>
          {errors.category && (
            <p className="text-red-500">Category is required</p>
          )}
          <p>Select Courses:</p>

          <div className="grid grid-cols-4 gap-1">
            {availableCourse?.map((course) => (
              <label key={course}>
                <input
                  type="checkbox"
                  {...register(`courses[${course}]`)}
                  value={course}
                  onChange={(e) => handleCourseChange(course, e.target.checked)}
                />
                {course}
              </label>
            ))}
          </div>

          <input
            type="password"
            {...register("password", {
              required: true,
              pattern: /^(?=.*[A-Z])(?=.*\d).+$/,
            })}
            placeholder="Password"
            className={`border border-black p-1 rounded mb-4 ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && (
            <p className="text-red-500">
              Password is required and must contain an uppercase letter and at
              least one number
            </p>
          )}

          <IoFingerPrintOutline
            className={`text-6xl ${print ? "text-green-600" : "text-red-600"}`}
          />

          <input
            className="p-2 bg-blue-600 text-white rounded-lg mt-4 cursor-pointer"
            value="Register"
            type="submit"
          />
        </form>

        <Link className="text-red-400 mt-10" to="/">
          Go Back to home
        </Link>
      </div>
    </div>
  );
};

export default Register;
