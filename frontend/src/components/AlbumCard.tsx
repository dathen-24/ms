import React from "react";
import { useNavigate } from "react-router-dom";

interface AlbumCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ image, name, desc, id }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/album/" + id)}
      className="
group
min-w-[190px]
max-w-[190px]
p-4
rounded-xl
bg-zinc-900/40
hover:bg-zinc-800/70
transition-all
duration-300
cursor-pointer
"
    >
      {" "}
      <div className="relative">
        {" "}
        <img
          src={image}
          alt={name}
          className="
         w-full
         aspect-square
         object-cover
         rounded-lg
         shadow-xl
         transition-transform
         duration-300
         group-hover:scale-[1.03]
       "
        />
      </div>
      <h3 className="mt-4 font-semibold text-white truncate">{name}</h3>
      <p className="mt-2 text-sm text-zinc-400 overflow-hidden">{desc}</p>
    </div>
  );
};

export default AlbumCard;
