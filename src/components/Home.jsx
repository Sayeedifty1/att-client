import { Link } from "react-router-dom";
import { useUser } from "../Provider/UserProvider";

const Home = () => {
  const { user } = useUser();
  return (
    <div>
      {user ? (
        <div className="w-[80%] mx-auto">
          <h2 className="text-4xl text-center">{user?.category} Panel</h2>
          <div className="mt-20 text-2xl">
            <h4>Name: {user?.name} </h4>
            <p>Profession: {user?.category}</p>
            <p className="mb-10">Email: {user?.email}</p>
            {user?.category === "Admin" && (
              <div>
                <Link
                  to="/register"
                  className="text-xl p-1 bg-slate-400
                                 rounded-lg text-white mr-6"
                >
                  Add Users
                </Link>
                <Link
                  to="/add-course"
                  className="text-xl p-1 bg-green-400
                                 rounded-lg text-white"
                >
                  Add Course
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-4xl text-center">Student Entry</h2>
          <h4 className="mx-auto text-center  text-2xl">
            Welcome to Premier University{" "}
          </h4>
          <p className="text-center">Department Of EEE</p>
        </div>
      )}
    </div>
  );
};

export default Home;
