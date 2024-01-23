import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { clsx } from "clsx";
import { NewEmployeeModal } from "./NewEmployeeModal";
import * as dayjs from "dayjs";
import { http } from "../../libs/axios";
import Pagination from "./Pagination";

import s from "./Home.module.scss";

export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  position: string;
  birth: Date;
}

interface FetchEmployeeDTO {
  data: Employee[];
  total: number;
}

function Home() {
  console.log("RERENDER");
  const navigate = useNavigate();

  const [Employee, setEmployee] = useState<Employee[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get("search") ?? "";

  const currentPage = Number(searchParams.get("page")) || 1;
  const [total, setTotal] = useState(0);
  const postsPerPage = 10;

  useEffect(() => {
    fetchEmployee();
  }, [currentPage, searchTerm]);

  const fetchEmployee = async () => {
    try {
      const response = await http.get<FetchEmployeeDTO>("/employees", {
        params: {
          page: currentPage,
          size: postsPerPage,
          searchTerm,
        },
      });

      setEmployee(response.data.data);
      setTotal(response.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={s.home}>
      <div className={s.container}>
        <div className={s.beforeTable}>
          <input
            type="text"
            className={s.filter}
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchParams((params) => {
                params.delete("page");
                if (!e.target.value) {
                  params.delete("search");
                  return params;
                }
                params.set("search", e.target.value);
                return params;
              });
            }}
          />
          <div className={s.btnWrapper}>
            <NewEmployeeModal fetchEmployee={fetchEmployee} />
            <button className={s.logoutBtn}>
              <Link onClick={logOut} to="/login" className={s.logoutLink}>
                Logout
              </Link>
            </button>
          </div>
        </div>
        <table className={s.contentTable}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Position</th>
              <th>Date of birth</th>
            </tr>
          </thead>
          <tbody>
            {Employee.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.position}</td>
                <td>{dayjs(employee.birth).format("DD.MM.YYYY")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          totalPosts={total}
          postsPerPage={postsPerPage}
          setCurrentPage={(page: number) => {
            setSearchParams((params) => {
              if (page === 1) {
                params.delete("page");
                return params;
              }
              params.set("page", page.toString());
              return params;
            });
          }}
        />
      </div>
    </div>
  );
}

export default Home;
