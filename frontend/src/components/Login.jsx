import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();
  const { idUser } = useAuth();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        credentials
      );
      login(response.data.token);
      idUser(response.data.id);
      user(response.data);
      console.log(localStorage.getItem("token"));
      console.log(localStorage.getItem("id"));

      toast.success("Login successful!");
      setInterval(() => {}, 100);
      // Navegar inmediatamente después del login exitoso
      navigate("/data");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <div className="row justify-content-center ">
        <div className="col-md-12 col-lg-12">
          <div
            className="card"
            style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}
          >
            <div className="card-body">
              <h2 className="card-title text-center">Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control px-5"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        username: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control px-5"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
                <div className="text-center">
                  <p className="mb-0">¿No tienes una cuenta?</p>
                  <Link to="/register">
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      style={{ color: "#f54749" }}
                    >
                      Regístrate aquí
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { Login };
