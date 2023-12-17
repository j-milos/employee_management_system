import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";
import { http } from "../../libs/axios";
import axios from "axios";
import s from "./registration.module.scss";

interface LoginForm {
  email: string;
  password: string;
}

const schema: ZodType<LoginForm> = z.object({
  email: z
    .string()
    .email("Email format is not valid")
    .nonempty("Email is required")
    .regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, {
      message: "Invalid email format",
    }),

  password: z
    .string()
    .min(5)
    .max(20)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/i, {
      message: "Password must contain at least one uppercase letter and number",
    }),
});
function Login() {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<LoginForm> =async (data) => {
    // async await, try catch
    // set token to local storage
    try{
      await http
      .post("http://localhost:3001/login", { data })
      .then((result) => {
        localStorage.setItem("token", result.data.token);

        if (result.status === 200) {
          navigate("/home");
        }
      })}
      catch(err){
        console.log(err);
        
      }
  };


  return (
    <div className={s.container}>
      <div className={s.card}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={s.loginRegiserForm}>
          <input
            type="email"
            placeholder="Enter Email"
            autoComplete="off"
            className={s.inputs}
            {...register("email")}
          />
          {errors.email && (
            <span className={s.errorMsg}>{errors.email.message}</span>
          )}

          <input
            type="password"
            placeholder="Enter Password"
            className={s.inputs}
            {...register("password")}
          />
          {errors.password && (
            <span className={s.errorMsg}>{errors.password.message}</span>
          )}

          <button type="submit" className={s.loginRegisterBtn}>
            Login
          </button>
        </form>
        <div className={s.dontHaveAcc}>
          <h3>Don't have an account?</h3>
          <a href="/register" className={s.link}>
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
