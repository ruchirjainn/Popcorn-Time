import { useState, useEffect, useRef } from "react";
import { useKey } from "../Hooks/useKey";
import { Loader } from "../Helper/Loader";
import StarRating from "../Hooks/StarRating";

const API_KEY = 'da1ee776';

export function MovieDetails({ selectedId, onCloseMovie, watchedMovies, onAddWatched }) {

    const [movie, setMovie] = useState({});
    const [userRating, setUserRating] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const countRef = useRef(0);

    useEffect(function () {
        if (userRating) countRef.current++;
    }, [userRating]);

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

    function handleAdd() {

        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(' ').at(0)),
            userRating,
            countRatingDecision: countRef.current
        }

        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    // Get the movie details using selectedMovieId(imdbID)
    useEffect(function () {

        async function getMovieDetails() {

            setIsLoading(true);

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


    // Handling Keypress events in React - CUSTOM HOOK
    useKey('Escape', onCloseMovie);

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