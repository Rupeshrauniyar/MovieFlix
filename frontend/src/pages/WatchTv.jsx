import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

const TV_EMBED_SERVERS = [
  {
    name: "AutoEmbed",
    getSrc: (id, ses, ep) => `https://autoembed.co/tv/tmdb/${id}-${ses}-${ep}`,
  },
  {
    name: "Vidsrc",
    getSrc: (id, ses, ep) => `https://vidsrc.to/embed/tv/${id}/${ses}/${ep}`,
  },
  {
    name: "MultiEmbed",
    getSrc: (id, ses, ep) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${ses}&e=${ep}`,
  },
];

const WatchTv = () => {
  const [showId, setShowId] = useState("");
  const [ses, setSes] = useState(1);
  const [ep, setEp] = useState(1);
  const params = useParams();
  const [searchResult, setSearchResult] = useState({});
  const [serverIdx, setServerIdx] = useState(0);
  const API_KEY = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const tvShowUrl = `https://api.themoviedb.org/3/tv/${params.id}?language=hi-IN`;
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
    setSes(Number(params.ses));
    setEp(Number(params.ep));
    handleSearch();
  }, [params]);

  return (
    <div className="w-full min-h-screen bg-zinc-900 flex flex-col items-center py-8 px-2 md:px-0">
      {params && searchResult && showId && ep && ses ? (
        <>
          <div className="w-full max-w-3xl mx-auto bg-zinc-800 rounded-xl shadow-lg p-6 mb-6 flex flex-col items-center">
            <h3 className="text-zinc-100 text-2xl font-bold mb-2 text-center">
              Now Playing:
              <span className="text-red-500 ml-2 text-xl font-light">{searchResult.original_name || searchResult.name}</span>
            </h3>
            <p className="text-center text-zinc-400 text-sm mb-2">{searchResult.overview}</p>
            <div className="flex flex-wrap gap-4 justify-center text-xs text-zinc-400">
              {searchResult.first_air_date && <span>First Air: {searchResult.first_air_date}</span>}
              {searchResult.vote_average && <span>Rating: {searchResult.vote_average}/10</span>}
              {searchResult.number_of_seasons && <span>Seasons: {searchResult.number_of_seasons}</span>}
            </div>
            <div className="flex flex-wrap gap-4 items-center justify-center mt-4 w-full">
              <div className="flex flex-col items-center">
                <label className="text-zinc-300 text-xs mb-1">Season</label>
                <select
                  className="bg-red-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-red-400"
                  onChange={(e) => {
                    setSes(Number(e.target.value));
                    navigate(`/watch/tv/${showId}/${e.target.value}/${ep}`);
                  }}
                  value={ses}
                >
                  {searchResult?.seasons?.map((season, i) => (
                    <option key={i} value={i + 1}>
                      Season {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col items-center">
                <label className="text-zinc-300 text-xs mb-1">Episode</label>
                <select
                  className="bg-red-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-red-400"
                  onChange={(e) => {
                    setEp(Number(e.target.value));
                    navigate(`/watch/tv/${showId}/${ses}/${e.target.value}`);
                  }}
                  value={ep}
                >
                  {Array.from({ length: searchResult?.seasons?.[ses - 1]?.episode_count || 0 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      Episode {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black mb-2">
            <iframe
              className="w-full h-full min-h-[300px] rounded-xl"
              src={TV_EMBED_SERVERS[serverIdx].getSrc(showId, ses, ep)}
              frameBorder="0"
              allowFullScreen
              scrolling="no"
              title="TV Player"
            />
          </div>
          <div className="flex gap-2 mb-4">
            {TV_EMBED_SERVERS.map((srv, idx) => (
              <button
                key={srv.name}
                className={`px-3 py-1 rounded ${serverIdx === idx ? "bg-red-600 text-white" : "bg-zinc-700 text-zinc-200"} transition`}
                onClick={() => setServerIdx(idx)}
              >
                {srv.name}
              </button>
            ))}
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
