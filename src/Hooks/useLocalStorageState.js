import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {

    // Retrieving the watched movie from localStorage
    const [value, setValue] = useState(function () {
        const storedValue = localStorage.getItem(key);

        const initialValue = storedValue ? JSON.parse(storedValue) : initialState;
        return initialValue;
    });

    // Storing the watched movies in Local Storage
    useEffect(function () {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

    return [value, setValue];
}