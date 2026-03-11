import { useState } from "react";
import type { CarQuery } from "./types";
import { useCars } from "./hooks/useCars";
import { CarCard } from "./components/CarCard";
import { Filters } from "./components/Filters";
import { Pagination } from "./components/Pagination";
import "./App.css";

const DEFAULT_QUERY: CarQuery = {
  page: 1,
  limit: 12,
  status: "AVAILABLE",
};

function App() {
  const [query, setQuery] = useState<CarQuery>(DEFAULT_QUERY);
  const { data, total, page, totalPages, loading, error } = useCars(query);

  function updateQuery(patch: Partial<CarQuery>) {
    setQuery((prev) => ({ ...prev, ...patch }));
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header__inner">
          <div className="header__brand">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M5 17H3v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0H9" />
              <path d="M10 6l-1 5h-4" />
            </svg>
            <h1>AutoHub</h1>
          </div>
          <p className="header__tagline">Find your perfect ride</p>
        </div>
      </header>

      <main className="main">
        <Filters query={query} onChange={updateQuery} />

        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => updateQuery({})}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="loading__spinner" />
            <p>Loading inventory...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <h2>No cars found</h2>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="car-grid">
              {data.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              onPageChange={(p) => updateQuery({ page: p })}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
