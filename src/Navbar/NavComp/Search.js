import { useRef } from "react";
import { useKey } from '../../Hooks/useKey';

export function Search({ query, setQuery }) {   // statefull componenet

    const searchRef = useRef(null);
  
    function keyPress() {
      if (document.activeElement === searchRef.current) return
      searchRef.current.focus();
      setQuery('');
    }
  
    // Focusing on the Search input when we click enter key
    useKey('Enter', keyPress);
  
    return (
      <input
        className="search"
        ref={searchRef}
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    );
  }