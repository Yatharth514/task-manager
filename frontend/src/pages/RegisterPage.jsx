import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage=()=>{
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name,setName]=useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        setError(null);

        try{
            await register({name,email,password});
            navigate('/login');
        }
        catch(err)
        {
            setError(err.response?.data?.detail || "Registeration failed. Try again.");
        }
        finally{
            setLoading(false);
        }

    };
    return (
        <div>
            <h1>Register Page</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" 
                placeholder="Enter the name"
                value={name}
                onChange={(e)=>setName(e.target.value)} />

                <input type="email" 
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />

                <input type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />

                {error && <p>{error}</p>} 

                <button type="submit"  disabled={loading}>
                    {loading?"Registeration in Process":"Register"}
                </button>

            </form>
             <Link to="/login">Already have an account? Login in </Link>
        </div>
    );

};
export default RegisterPage;