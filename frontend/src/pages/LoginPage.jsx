import { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();   //prevent reloading 
        setLoading(true);
        setError(null);

        try {
            await login({email, password});  //here we dont need to pass again to backend it is handle by auth context and authservices js
            navigate('/dashboard');
        }
        catch (err) {
            setError(err.response?.data?.detail || "Login failed. Try again.");
        }
        finally {
            setLoading(false);
        }
    };

    return ( // here we are adding the error para to show if there is an error and loading ux which will disable the bbuttons at the time of loading
        <div>
            <h1>Login Page</h1> 
            <form onSubmit={handleSubmit}>
                <input type="email" 
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />

                <input type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />

                {error && <p>{error}</p>} 

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Log In"}
                </button> 
            </form>
            <Link to="/register">Don't have an account? Register</Link>

        </div>
    );

};
export default LoginPage;