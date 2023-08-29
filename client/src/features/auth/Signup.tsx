import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormEvent } from "react";
import { http } from "../../libs/axios";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

function Signup() {
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState<string | number>();
  // const [password, setPassword] = useState<string | number>();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<RegisterForm>();
  const onSubmit: SubmitHandler<RegisterForm> = (data) => {
    http
      .post("http://localhost:3001/register", { data })
      .then((result) => {
        console.log(result);
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   http
  //     .post("http://localhost:3001/register", { name, email, password })
  //     .then((result) => {
  //       console.log(result);
  //       navigate("/login");
  //     })
  //     .catch((err) => console.log(err));
  // };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <strong>Name</strong>

            <input
              type="text"
              placeholder="Enter Name"
              autoComplete="off"
              className="form-control rounded-0"
              {...register("name", { required: true, maxLength: 20 })}
            />
          </div>
          <div className="mb-3">
            <strong>Email</strong>

            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              className="form-control rounded-0"
              {...register("email", {
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              })}
            />
          </div>
          <div className="mb-3">
            <strong>Password</strong>

            <input
              type="password"
              placeholder="Enter Password"
              className="form-control rounded-0"
              {...register("password", {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/i,
              })}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Register
          </button>
        </form>
        <p>Already Have an Account</p>
        <Link
          to="/login"
          className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
