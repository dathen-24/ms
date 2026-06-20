import { useNavigate } from "react-router-dom";
import { useUserData } from "../context/UserContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuth, logoutUser } = useUserData();

  return (
    <div className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-zinc-800">
      {" "}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left */}{" "}
        <div className="flex items-center gap-4">
          {" "}
          <img src="/spotify.png" className="w-8 h-8" />
          <span className="font-bold">Spotify</span>
        </div>
        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            className="
          hidden md:block
          px-4 py-2
          bg-white
          text-black
          rounded-full
          text-sm
          font-semibold
          hover:scale-105
          transition
        "
          >
            Explore Premium
          </button>

          <button
            className="
          hidden md:block
          px-4 py-2
          bg-black
          text-white
          border border-zinc-700
          rounded-full
          text-sm
          font-semibold
          hover:bg-zinc-900
          transition
        "
          >
            Install App
          </button>

          {isAuth ? (
            <>
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold">
                U
              </div>

              <button
                onClick={logoutUser}
                className="
              px-4 py-2
              bg-zinc-800
              hover:bg-zinc-700
              rounded-full
              text-sm
              transition
            "
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="
            px-4 py-2
            bg-white
            text-black
            rounded-full
            text-sm
            font-semibold
            hover:scale-105
            transition
          "
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
