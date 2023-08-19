import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import { NewArtistModal } from "./NewArtistModal";
import * as dayjs from "dayjs";
import { http } from "../../libs/axios";
import Pagination from "./Pagination";

import s from "./Home.module.scss";

function Home() {
  const navigate = useNavigate();

  const [artists, setArtist] = useState([]);
  // DONT NEED
  const [searchTerm, setSearchTerm] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  // const cp = searchParams.get('page') ?? 1;
  const [total, setTotal] = useState(0);
  const postsPerPage = 8;
  total;

  useEffect(() => {
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
      const response = await http.get("/artists", {
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
            setSearchTerm(e.target.value);
            setCurrentPage(1);
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
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
}

export default Home;
