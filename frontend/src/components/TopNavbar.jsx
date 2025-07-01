import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Search} from "lucide-react";
import axios from "axios";
import movieFlix from "/movieFlix.png";

const TopNavbar = () => {
  const [isSearch, setIsSearch] = useState(false);
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();

  const handleSearch = async (e) => {
    setSearchValue(e.target.value);
    try {
      if (e.target.value.trim()) {
        setIsSearch(true);
        const tvShowUrl = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(e.target.value)}&language=hi-IN&region=IN&page=1`;
        const movieUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(e.target.value)}&language=hi-IN&region=IN&page=1`;
        const [reqTvShow, reqMovie] = await Promise.all([
          axios.get(tvShowUrl, {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }),
          axios.get(movieUrl, {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }),
        ]);
        const tvShowResults = reqTvShow?.data?.results || [];
        const movieResults = reqMovie?.data?.results || [];
        if (tvShowResults.length > 0 || movieResults.length > 0) {
          setSearchResult([...movieResults?.map((movie) => ({...movie, type: "movie"})), ...tvShowResults?.map((tvShow) => ({...tvShow, type: "show"}))]);
        } else {
          setSearchResult([]);
        }
      } else {
        setIsSearch(false);
        setSearchResult([]);
      }
    } catch (err) {
      setIsSearch(false);
      setSearchResult([]);
      console.log(err);
    }
  };

  useEffect(() => {
    window.addEventListener("click", () => {
      setIsSearch(false);
    });
  }, []);

  return (
    <>
      <nav className="sticky top-0 bg-zinc-900 w-full h-16 flex items-center justify-between sm:px-6 px-2 z-30 shadow-lg">
        <div className="flex items-center space-x-6">
          <Link to="/">
            <img
              src={movieFlix}
              className="w-20 h-20 sm:w-28 sm:h-28 object-cover"
              alt="MovieFlix Logo"
            />
          </Link>
          <div className="hidden md:flex items-center space-x-6 text-zinc-200 font-medium text-lg">
            <Link
              to="/"
              className="hover:text-red-500 transition-colors">
              Home
            </Link>
            <a
              href="/#movies"
              className="hover:text-red-500 transition-colors">
              Movies
            </a>
            <a
              href="/#shows"
              className="hover:text-red-500 transition-colors">
              Shows
            </a>
          </div>
        </div>
        <div className="relative w-64 max-w-xs">
          <div className="flex items-center bg-zinc-800 rounded-full px-3 py-1 shadow-inner focus-within:ring-2 focus-within:ring-red-500 transition-all">
            <Search className="text-red-500 mr-2" />
            <input
              onFocus={(e) => {
                if (e.target.value.trim()) {
                  setIsSearch(true);
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="bg-transparent w-full border-none outline-none text-zinc-200 placeholder-zinc-400 py-1"
              type="search"
              placeholder="Search for movies or shows..."
              value={searchValue}
              onChange={handleSearch}
            />
          </div>
          {isSearch && (
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="absolute left-0 mt-2 overflow-x-hidden w-full max-h-80 bg-zinc-800 rounded-xl shadow-xl z-40 overflow-y-auto border border-zinc-700">
              <div className="flex flex-col divide-y divide-zinc-700">
                {searchResult?.length > 0 ? (
                  searchResult
                    .slice()
                    .sort((a, b) => b.popularity - a.popularity)
                    .map((show, i) => (
                      <div
                        key={i}
                        className="flex items-center p-2 hover:bg-zinc-700 cursor-pointer transition-all"
                        onClick={() => {
                          setIsSearch(false);
                          setSearchValue("");
                          navigate(show.type === "movie" ? `/watch/${show.id}` : `/watch/tv/${show.id}/1/1`);
                        }}>
                        <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-900">
                          <img
                            className="w-full h-full object-cover"
                            src={
                              show.poster_path
                                ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                                : show.backdrop_path
                                ? `https://image.tmdb.org/t/p/w500${show.backdrop_path}`
                                : `${movieFlix}`
                            }
                            alt={show.title || show.original_name}
                          />
                        </div>
                        <div className="ml-3 flex flex-col w-44">
                          <h3 className="truncate font-semibold text-zinc-100 text-base">{show.original_title || show.title || show.original_name}</h3>
                          <p className="truncate text-xs text-zinc-400">{show.overview}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="p-4 text-center text-zinc-400 text-sm">No results found.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default TopNavbar;
