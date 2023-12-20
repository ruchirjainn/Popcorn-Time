import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const API_KEY = 'da1ee776';

// ------------------APP-------------------
export default function App() {

  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(movieId) {

    if (selectedId === movieId) setSelectedId(id => null);
    else setSelectedId(movieId);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie])
  }

  function handleDeleteWatched(movieId) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== movieId));
  }

  // Only runs while mounting of app means for the very first time
  useEffect(function () {

    // No relation with React
    const controller = new AbortController();

    async function fetchMovie() {

      try {
        setIsLoading(true);
        setError('');

        const res = await
          fetch(
            `http://www.omdbapi.com/?i=tt3896198&apikey=${API_KEY}&s=${query}`,
            { signal: controller.signal }
          )

        // The error thrown here is catched by below catch block
        if (!res.ok) throw new Error('Something went wrong with fetching movies')

        const data = await res.json();

        if (data.Response === 'False') throw new Error(data.Error);
        setMovies(data.Search);

        setError('');

      } catch (err) {

        console.log('Error is from App.js useEffect is: ' + err);

        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }

    }

    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }

    handleCloseMovie();
    fetchMovie();

    // Clean for browser Data fetching which is waste (T -> TE -> TES -> TEST)
    return function () {
      controller.abort();
    }

  }, [query]);


  return (
    <>

      <Navbar>   {/* component composition - eliminates prop drilling */}

        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />

      </Navbar>

      <Main>

        {/* WAY-1 */}
        {/* <Box element={<MovieList movies={movies} />} />
        <Box element={
          <>
            <WatchedSummary watched={watched} />
            <WatchedMovieList watched={watched} />
          </>
        } /> */}

        {/* WAY-2 */}
        <Box>
          {
            isLoading ? <Loader /> :
              <MovieList
                movies={movies}
                onSelectMovie={handleSelectMovie} />
          }
          {
            error ? <ErrorMessage message={error} /> : ''
          }
        </Box>

        <Box>
          {
            selectedId ?
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
                watchedMovies={watched}
                onAddWatched={handleAddWatched} /> :
              <>
                <WatchedSummary watched={watched} />
                <WatchedMovieList watched={watched} onDeleteWatched={handleDeleteWatched} />
              </>
          }

        </Box>

      </Main>

    </>
  );
}

// ---------------------Loader-----------------------
function Loader() {
  return (
    <p className="loader">
      Loading...
    </p>
  );
}

// ---------------------Error Message----------------
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>💀</span>{message}
    </p>
  );
}

//  --------------------NAVBAR-----------------------
function Navbar({ children }) {

  return (

    <nav className="nav-bar">
      {children}
    </nav>

  );
}

function Logo() {    // stateless componenet
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {   // statefull componenet

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}


// --------------------Main Box-------------------------
function Main({ children }) {

  return (
    <main className="main">

      {children}

    </main>
  );
}

// -------------------BOX FOR LEFT & RIGHT--------------
function Box({ children }) {

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {
        isOpen && children
      }
    </div>
  );
}

// ------------------------Left List Box--------------------
function MovieList({ movies, onSelectMovie }) {

  return (
    <ul className="list list-movies">
      {
        movies?.map((movie) => (
          <Movie movie={movie} onSelectMovie={onSelectMovie} key={movie.imdbID} />
        ))
      }
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)} key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}


// -----------------------Movie Detail----------------------
function MovieDetails({ selectedId, onCloseMovie, watchedMovies, onAddWatched }) {

  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const alreadyWatchedMovie = watchedMovies.find(movie => movie.imdbID === selectedId);
  const alreadyWatchedMovieRating = alreadyWatchedMovie?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre
  } = movie;

  /* eslint-disable */
  //  if (imdbRating > 8) [isTop, setIsTop] = useState(true);

  // if(imdbRating > 6) return <p>Greatest ever!</p>

  // const [isTop, setIsTop] = useState(imdbRating > 8);
  // console.log(isTop);

  // useEffect(function () {
  //   setIsTop(imdbRating > 8);
  // }, [imdbRating]);

  const isTop = imdbRating > 8;
  console.log(isTop);

  const [avgRating, setAvgRating] = useState(0);

  function handleAdd() {

    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating
    }

    onAddWatched(newWatchedMovie);
    onCloseMovie();

    // setAvgRating(Number(imdbRating));   // stale state
    // setAvgRating((avgRating) => (avgRating + userRating) / 2);
  }

  // Get the movie details using selectedMovieId(imdbID)
  useEffect(function () {

    async function getMovieDetails() {

      // setIsLoading(true);

      const res = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`)
      const data = await res.json();

      setMovie(data);

      setIsLoading(false);

    }

    getMovieDetails();

  }, [selectedId]);


  // Changing web page title after clicking a movie
  useEffect(function () {
    if (!title) return
    document.title = `Movie | ${title}`

    // Clean up function of a useEffect 
    return function () {
      document.title = 'Popcorn Time';
    }

  }, [title]);


  // Handling Keypress events in React
  useEffect(function () {

    function callback(e) {
      if (e.code === 'Escape') {
        onCloseMovie();
      }
    }

    document.addEventListener('keydown', callback);

    return function () {
      document.removeEventListener('keydown', callback);
    }

  }, [onCloseMovie]);


  return (
    <div className="details">

      {
        isLoading ? <Loader /> :
          <>
            <header>

              <button className="btn-back" onClick={() => onCloseMovie()}>
                &larr;
              </button>

              <img src={poster} alt={`Poster of ${movie} movie`} />

              <div className="details-overview">
                <h2>{title}</h2>
                <p>
                  {released} &bull; {runtime}
                </p>
                <p>{genre}</p>
                <p>
                  <span>⭐</span>
                  {imdbRating} IMDb Rating
                </p>
              </div>

            </header>

            {/* <p>{avgRating}</p> */}

            <section>

              <div className="rating">
                {
                  alreadyWatchedMovie ?
                    <p>You rated this movie {alreadyWatchedMovieRating} 🌟</p> :
                    <>
                      <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                      {
                        userRating > 0 ?
                          <button className="btn-add" onClick={handleAdd}>+ Add to list</button> : ''
                      }
                    </>
                }
              </div>

              <p>
                <em>{plot}</em>
              </p>

              <p>Starring {actors}</p>

              <p>Directed by {director}</p>

            </section>
          </>
      }

    </div>
  );

}


// ----------------------Movies Right Box------------------------

function WatchedSummary({ watched }) {

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} onDeleteWatched={onDeleteWatched} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>X</button>
      </div>
    </li>
  );
}