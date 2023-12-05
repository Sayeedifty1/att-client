import { Link } from "react-router-dom";
import { useUser } from "../Provider/UserProvider";
import logo from "../assets/logo.jpeg";

const Navbar = () => {
    const { user, logout } = useUser();

    // Logout function
    const signOut = () => {
        logout();
    };
    console.log(user)

    return (
        <div>
            <div className="navbar bg-base-100 w-[80%] mx-auto">
                <div className="flex-1">
                    <img src={logo} alt="logo" className="w-30 h-20" />
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        {user ? (
                            <li>
                                <Link to="/">Welcome: {user.name}</Link>
                                {user.category === "Teacher" ? (
                                    <Link to="/teacher-dashboard">Dashboard</Link>
                                ) : user.category === "Student" ? (
                                    <Link to="/std-dashboard">Dashboard</Link>
                                ) : (
                                    <Link to="/dashboard">Dashboard</Link>
                                )}
                                {
                                    user?.category === "Admin" && (
                                        <Link to="/admin-attendance" >Check Attendance</Link>
                                    )
                                }
                                <Link onClick={signOut}>Logout</Link>
                            </li>
                        ) : (
                            <Link to="/login">
                                <button>Login</button>
                            </Link>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
