import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { getUser, logout } = useAuth();
  const navigate = useNavigate();
  const user = getUser();

  const [userData, setUserData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setUserData({
        username: user.username || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, []); // Run only once on mount

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:3000/api/users/update/profile",
        {
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Profil actualizado!");
      setInterval(() => {}, 100);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    if (window.confirm("Estas seguro que quieres eliminar tu cuenta?.")) {
      try {
        await axios.delete(
          `http://localhost:3000/api/users/delete/profile/${id}`,

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        logout();
        toast.success("Cuenta Eliminada");
        setInterval(() => {
          navigate("/register");
        }, 1000);
      } catch (error) {
        toast.error(error.response?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-12">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title text-center">Perfil</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control px-5"
                  value={userData.username}
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control px-5"
                  value={userData.firstName}
                  onChange={(e) =>
                    setUserData({ ...userData, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control px-5"
                  value={userData.lastName}
                  onChange={(e) =>
                    setUserData({ ...userData, lastName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control px-5"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 mb-3">
                Modificar Perfil
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-danger w-100"
              >
                Eliminar Cuenta
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Profile };
