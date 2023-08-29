import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormEvent } from "react";
import { http } from "../../libs/axios";
import axios from "axios";

interface LoginForm {
  email: string;
  password: string;
}

function Login() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginForm>();
  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    // async await, try catch
    // set token to local storage
    http
      .post("http://localhost:3001/login", { data })
      .then((result) => {
        result.data.token;
        console.log(result);
        // if (result.data === "Success") {
        //   navigate("/home");
        // }
      })
      .catch((err) => console.log(err));
  };

  // const handleSubmit = (e: FormEvent) => {
  //   e.preventDefault();
  //   http
  //     .post("http://localhost:3001/login", { email, password })
  //     .then((result) => {
  //       console.log(result);
  //       if (result.data === "Success") {
  //         navigate("/home");
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            Login
          </button>
        </form>
        <p>Already Have an Account</p>
        <Link
          to="/register"
          className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Login;
