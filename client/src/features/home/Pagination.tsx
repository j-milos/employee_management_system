import s from "./Pagination.module.scss";

interface Props {
  totalPosts: number;
  postsPerPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<Props> = ({
  totalPosts,
  postsPerPage,
  setCurrentPage,
}) => {
  const pages = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pages.push(i);
  }

  return (
    <div className={s.pagination}>
      {pages.map((page, index) => {
        return (
          <button key={index} onClick={() => setCurrentPage(page)}>
            {page}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;
