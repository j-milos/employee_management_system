import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";
import { FormEvent } from "react";
import { http } from "../../libs/axios";
import s from "./registration.module.scss";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}
const schema: ZodType<RegisterForm> = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be 2 or more characters long" })
    .max(30)
    .nonempty(),
  email: z
    .string()
    .email("Email format is not valid")
    .nonempty("Email is required")
    .regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, {
      message: "Invalid email format",
    }),

  password: z
    .string()
    .min(5, { message: "Password must be 5 or more characters long" })
    .max(20)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/i, {
      message: "Password must contain at least one uppercase letter and number",
    }),
});

function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    try {
      await http
        .post("http://localhost:3001/register", { data })
        .then((result) => {
          console.log(result);
          navigate("/login");
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.card}>
        <h2>Registartion</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={s.loginRegiserForm}>
          <input
            type="text"
            id="name"
            placeholder="Enter Name"
            autoComplete="off"
            className={s.inputs}
            {...register("name")}
          />
          {errors.name && (
            <span className={s.errorMsg}>{errors.name.message}</span>
          )}

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
            Register
          </button>
        </form>
        <div className={s.dontHaveAcc}>
          <h3>Already have an account?</h3>
          <a href="/login" className={s.link}>
            Login now
          </a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
