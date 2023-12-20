import { useState } from "react";

// ----------------Custom Hooks--------------------
import { useMovies } from "./Hooks/useMovies";
import { useLocalStorageState } from "./Hooks/useLocalStorageState";

// ----------------Navbar-----------------------
import { Navbar } from './Navbar/Navbar';
import { Logo } from './Navbar/NavComp/Logo';
import { Search } from './Navbar/NavComp/Search';
import { NumResults } from './Navbar/NavComp/NumResults';

// -----------------Helper-----------------------
import { Loader} from "./Helper/Loader";
import { ErrorMessage } from "./Helper/ErrorMessage";

// ------------------Left Box---------------------
import { MovieList } from "./MovieList/MovieList";

// ------------------Right Box---------------------
import { MovieDetails } from "./MovieDetails/MovieDetails";

import {WatchedSummary} from './WatchedMovie/WatchedSummary';
import { WatchedMovieList } from "./WatchedMovie/WatchedMovieList";

// Left Box - Movie List & Right Box - MovieDetails, WatchedMovie folders

// ------------------APP-------------------
export default function App() {

  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  // Getting the movies from the Movie API - CUSTOM HOOK
  const { movies, isLoading, error } = useMovies(query);

  // Retrieving the watched movie from localStorage - CUSTOM HOOK
  const [watched, setWatched] = useLocalStorageState([], 'watched');

  /*
  useEffect(function () {
    console.log('After initial render');
  }, [])

  useEffect(function () {
    console.log('After every render');
  })

  useEffect(function () {
    console.log('D');
  }, [query])

  console.log('During render')
  */

  function handleSelectMovie(movieId) {
    if (selectedId === movieId) setSelectedId(id => null);
    else setSelectedId(movieId);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie]);
  }

  function handleDeleteWatched(movieId) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== movieId));
  }

  // Only runs while mounting of app means for the very first time
  return (
    <>

      {/* component composition - eliminates prop drilling */}
      <Navbar>

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


// --------------------Main Box-------------------------
function Main({ children }) {

  return (
    <main className="main">

      {children}

    </main>
  );
}

// -------------------REUSABLE BOX FOR LEFT & RIGHT--------------
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
        // isOpen && children
        isOpen ? children : ''
      }
    </div>
  );
}







