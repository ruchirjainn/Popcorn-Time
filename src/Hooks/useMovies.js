import { useState, useEffect } from "react";

const API_KEY = 'da1ee776';

// Custom Hooks
export function useMovies(query) {

    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');


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

        fetchMovie();

        // Clean for browser Data fetching which is waste (T -> TE -> TES -> TEST)
        return function () {
            controller.abort();
        }

    }, [query]);

    return {movies, isLoading, error};

}