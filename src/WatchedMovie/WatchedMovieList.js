import { WatchedMovie } from "./WatchedMovie/WatchedMovie";

export function WatchedMovieList({ watched, onDeleteWatched }) {
    return (
      <ul className="list">
        {watched.map((movie) => (
          <WatchedMovie movie={movie} onDeleteWatched={onDeleteWatched} key={movie.imdbID} />
        ))}
      </ul>
    );
  }