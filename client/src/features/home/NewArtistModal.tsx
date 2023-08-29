import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { http } from "../../libs/axios";

import s from "./NewArtistModal.module.scss";
import { Artist } from "./Home";

interface Props {
  fetchArtists: () => void;
}

export const NewArtistModal: React.FC<Props> = ({ fetchArtists }) => {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal((value) => !value);
  };

  const schema = yup.object().shape({
    firstName: yup.string().required("First name is Required"),
    lastName: yup.string().required("Last name is Required"),
    position: yup.string().required("What is your current position"),
    birth: yup
      .date()
      .typeError("When is your birthday")
      .required("Birthday is required."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: Omit<Artist, "_id">) => {
    try {
      await http.post("/artists", data);
      setModal(false);
      reset();
      fetchArtists();
    } catch (error) {
      console.error(error);
    }
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }
  return (
    <>
      <button onClick={toggleModal} className={s.btnModal}>
        Add Artist
      </button>

      {modal && (
        <div className={s.modal}>
          <div onClick={toggleModal} className={s.overlay}></div>
          <div className={s.modalContent}>
            <div className={s.header}>
              <h1 className={s.headline}>Artists information</h1>

              <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
                <input
                  type="text"
                  placeholder="First Name"
                  {...register("firstName")}
                />
                <p>{errors.firstName?.message}</p>
                <input
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName")}
                />
                <p>{errors.lastName?.message}</p>
                <input
                  type="text"
                  placeholder="Positon"
                  {...register("position")}
                />
                <p>{errors.position?.message}</p>

                <input
                  type="date"
                  placeholder="Birtday"
                  {...register("birth")}
                />
                <p>{errors.birth?.message}</p>

                <input
                  className={s.button}
                  type="submit"
                  // onClick={setArtist(...artists)}
                />
              </form>
            </div>
            <button className={s.closeModal} onClick={toggleModal}>
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
};
