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

    return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800">
            
            <h1 className="text-4xl font-bold text-white text-center mb-8">
                Login Page
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">

                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />

                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />

                {error && (
                    <p className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition duration-200"
                >
                    {loading ? "Logging in..." : "Log In"}
                </button>
            </form>

            <p className="text-gray-400 text-center mt-6">
                Don't have an account?{" "}
                <Link
                    to="/register"
                    className="text-blue-400 hover:text-blue-300 font-medium"
                >
                    Register
                </Link>
            </p>
        </div>
    </div>
);

};
export default LoginPage;