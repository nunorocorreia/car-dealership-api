import type { CarQuery, CarStatus } from "../types";

interface FiltersProps {
  query: CarQuery;
  onChange: (patch: Partial<CarQuery>) => void;
}

const MAKES = [
  "Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", "Tesla",
  "Chevrolet", "Audi", "Hyundai", "Kia", "Subaru", "Mazda",
  "Volkswagen", "Nissan", "Jeep", "Porsche", "Lexus", "Dodge",
  "Ram", "Volvo", "Rivian",
];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "year-desc", label: "Year: Newest" },
  { value: "year-asc", label: "Year: Oldest" },
  { value: "mileage-asc", label: "Mileage: Low to High" },
  { value: "mileage-desc", label: "Mileage: High to Low" },
];

export function Filters({ query, onChange }: FiltersProps) {
  const currentSort = query.sortBy ? `${query.sortBy}-${query.order}` : "";

  function handleSortChange(value: string) {
    if (!value) {
      onChange({ sortBy: undefined, order: undefined });
    } else {
      const [sortBy, order] = value.split("-") as [CarQuery["sortBy"], CarQuery["order"]];
      onChange({ sortBy, order });
    }
  }

  function handleReset() {
    onChange({
      make: undefined,
      status: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: undefined,
      order: undefined,
    });
  }

  const hasActiveFilters = query.make || query.status !== "AVAILABLE" || query.minPrice || query.maxPrice || query.sortBy;

  return (
    <div className="filters">
      <div className="filters__row">
        <div className="filter-group">
          <label className="filter-label">Make</label>
          <select
            className="filter-select"
            value={query.make ?? ""}
            onChange={(e) => onChange({ make: e.target.value || undefined, page: 1 })}
          >
            <option value="">All Makes</option>
            {MAKES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select
            className="filter-select"
            value={query.status ?? "AVAILABLE"}
            onChange={(e) => onChange({ status: (e.target.value || undefined) as CarStatus, page: 1 })}
          >
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Min Price</label>
          <input
            type="number"
            className="filter-input"
            placeholder="$0"
            value={query.minPrice ?? ""}
            onChange={(e) =>
              onChange({ minPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })
            }
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Max Price</label>
          <input
            type="number"
            className="filter-input"
            placeholder="No limit"
            value={query.maxPrice ?? ""}
            onChange={(e) =>
              onChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })
            }
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Sort By</label>
          <select
            className="filter-select"
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button className="filter-reset" onClick={handleReset}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
