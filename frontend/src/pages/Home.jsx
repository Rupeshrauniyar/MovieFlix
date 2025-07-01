import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const API_KEY = import.meta.env.VITE_API_KEY;
  const getMovies = async () => {
    try {
      const url = `https://api.themoviedb.org/3/movie/now_playing?language=hi-IN&region=IN&page=1`;
      const req = await axios.get(url, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      if (req?.data?.results?.length > 0) {
        setMovies(req.data.results);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getTvShow = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const url2 = `https://api.themoviedb.org/3/discover/tv?language=hi-IN&region=IN&sort_by=release_date.desc&original_language=hi&release_date.lte=${today}`;
      const req = await axios.get(url2, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      if (req?.data?.results?.length > 0) {
        setShows(req.data.results);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getMovies();
    getTvShow();
  }, []);

  return (
    <div className="w-full min-h-screen bg-zinc-900 pb-16 px-2 md:px-8">
      <section className="max-w-7xl mx-auto">
        <h2
          className="font-bold text-zinc-100 text-3xl mt-8 mb-4 border-l-4 border-red-500 pl-3"
          id="movies">
          Movies
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((show, i) => (
            <Link
              to={`/watch/${show.id}`}
              key={i}>
              <div className="group bg-zinc-800 rounded-2xl shadow-lg overflow-hidden aspect-[2/3] relative cursor-pointer transition-transform hover:scale-105">
                <img
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
                  alt={show.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-lg font-semibold text-zinc-100 truncate">{show.original_name ? show.original_name : show.title}</p>
                  <p className="text-xs text-zinc-300 mt-1 line-clamp-2">{show.overview}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto mt-12">
        <h2
          className="font-bold text-zinc-100 text-3xl mb-4 border-l-4 border-red-500 pl-3"
          id="shows">
          Shows
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {shows.map((show, i) => (
            <Link
              to={`/watch/tv/${show.id}/1/1`}
              key={i}>
              <div className="group bg-zinc-800 rounded-2xl shadow-lg overflow-hidden aspect-[2/3] relative cursor-pointer transition-transform hover:scale-105">
                <img
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
                  alt={show.original_name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-lg font-semibold text-zinc-100 truncate">{show.original_name}</p>
                  <p className="text-xs text-zinc-300 mt-1 line-clamp-2">{show.overview}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
