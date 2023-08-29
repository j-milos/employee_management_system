import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { clsx } from "clsx";
import { NewArtistModal } from "./NewArtistModal";
import * as dayjs from "dayjs";
import { http } from "../../libs/axios";
import Pagination from "./Pagination";

import s from "./Home.module.scss";
import { useCookies } from "react-cookie";

export interface Artist {
  _id: string;
  firstName: string;
  lastName: string;
  position: string;
  birth: Date;
}

interface FetchAtistsDTO {
  data: Artist[];
  total: number;
}

function Home() {
  console.log("RERENDER");
  const navigate = useNavigate();

  const [artists, setArtist] = useState<Artist[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // null undefined;
  const searchTerm = searchParams.get("search") ?? "";
  // string number boolean null undefined NaN
  // ""     0      false   null undefined NaN
  const currentPage = Number(searchParams.get("page")) || 1;
  const [total, setTotal] = useState(0);
  const postsPerPage = 10;
  const [cookies] = useCookies(["token"]);

  // umesto ovoga probaj da izvuces iz browsera localStorage sa key-em: 'token'
  // jwt.decode za tu vrednost
  // proveri expiration time da li je istekao u odnosu na danasnji datum
  useEffect(() => {
    const curentDate = Date.now();
    console.log(cookies);
    http
      .get("/home")
      .then((result) => {
        console.log(result);
        if (result.data !== "Success") {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetchArtists();
  }, [currentPage, searchTerm]);

  const fetchArtists = async () => {
    try {
      const response = await http.get<FetchAtistsDTO>("/artists", {
        params: {
          page: currentPage,
          size: postsPerPage,
          searchTerm,
        },
      });

      setArtist(response.data.data);
      setTotal(response.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={clsx(s.body)}>
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
        <NewArtistModal fetchArtists={fetchArtists} />
      </div>

      <div className={s.tableposition}>
        <table className={s.secondTable}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Position</th>
              <th>Date of birth</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist) => (
              <tr key={artist._id}>
                <td>{artist.firstName}</td>
                <td>{artist.lastName}</td>
                <td>{artist.position}</td>
                <td>{dayjs(artist.birth).format("DD.MM.YYYY")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
  );
}

export default Home;
