export function NumResults({ movies }) {
    return (
      <p className="num-results">
        Found <strong style={{color: '#1C82AD'}} >{movies.length}</strong> results
      </p>
    );
  }
  