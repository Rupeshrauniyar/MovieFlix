import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

const WatchTv = () => {
  const [showId, setShowId] = useState("");
  const params = useParams();
  const [searchResult, setSearchResult] = useState({});
  const API_KEY = import.meta.env.VITE_API_KEY;

  const handleSearch = async () => {
    try {
      const tvShowUrl = `https://api.themoviedb.org/3/movie/${params.id}?language=hi-IN`;
      const res = await axios.get(tvShowUrl, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      const tvShowResults = res?.data || {};
      if (tvShowResults.id) {
        setSearchResult(tvShowResults);
      } else {
        setSearchResult({});
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setShowId(params.id);
    handleSearch();
  }, [params]);

  return (
    <div className="w-full min-h-screen bg-zinc-900 flex flex-col items-center py-8 px-2 md:px-0">
      {params && searchResult && showId ? (
        <>
          <div className="w-full max-w-3xl mx-auto bg-zinc-800 rounded-xl shadow-lg p-6 mb-6 flex flex-col items-center">
            <h3 className="text-zinc-100 text-2xl font-bold mb-2 text-center">
              Now Playing:
              <span className="text-red-500 ml-2 text-xl font-light">
                {searchResult.original_name || searchResult.original_title || searchResult.title}
              </span>
            </h3>
            <p className="text-center text-zinc-400 text-sm mb-2">
              {searchResult.overview}
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-xs text-zinc-400">
              {searchResult.release_date && <span>Release: {searchResult.release_date}</span>}
              {searchResult.runtime && <span>Runtime: {searchResult.runtime} min</span>}
              {searchResult.vote_average && <span>Rating: {searchResult.vote_average}/10</span>}
            </div>
          </div>
          <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
            <iframe
              className="w-full h-full min-h-[300px] rounded-xl"
              src={`https://autoembed.co/movie/tmdb/${showId}`}
              frameBorder="0"
              allowFullScreen
              scrolling="no"
              title="Movie Player"
            />
          </div>
          <div className="w-full max-w-3xl mx-auto mt-4">
            <p className="text-center text-green-500 text-sm">If the player doesn't work try another server.</p>
            <p className="text-center text-green-500 text-sm">If you didn't find your choiced language then try Server 2.</p>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default WatchTv;
