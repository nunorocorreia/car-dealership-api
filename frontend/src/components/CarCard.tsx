import type { Car } from "../types";

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "var(--color-success)",
  RESERVED: "var(--color-warning)",
  SOLD: "var(--color-danger)",
};

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents);
}

function formatMileage(miles: number) {
  return new Intl.NumberFormat("en-US").format(miles) + " mi";
}

export function CarCard({ car }: { car: Car }) {
  const primaryImage = car.images?.find((img) => img.isPrimary) ?? car.images?.[0];

  return (
    <article className="car-card">
      <div className="car-card__image">
        {primaryImage ? (
          <img src={`http://localhost:3000${primaryImage.url}`} alt={`${car.make} ${car.model}`} />
        ) : (
          <div className="car-card__placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M5 17H3v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0H9" />
              <path d="M10 6l-1 5h-4" />
            </svg>
          </div>
        )}
        <span
          className="car-card__status"
          style={{ backgroundColor: STATUS_COLORS[car.status] }}
        >
          {car.status}
        </span>
      </div>
      <div className="car-card__body">
        <h3 className="car-card__title">
          {car.year} {car.make} {car.model}
        </h3>
        <div className="car-card__pricing">
          {car.discountAmount > 0 ? (
            <>
              <span className="car-card__price car-card__price--discounted">
                {formatPrice(car.discountedPrice)}
              </span>
              <span className="car-card__price car-card__price--original">
                {formatPrice(car.price)}
              </span>
              <span className="car-card__discount-badge">
                {formatPrice(car.discountAmount)} off
              </span>
            </>
          ) : (
            <span className="car-card__price">{formatPrice(car.price)}</span>
          )}
        </div>
        <div className="car-card__details">
          <span className="car-card__detail">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            {formatMileage(car.mileage)}
          </span>
          <span className="car-card__detail">
            <span
              className="car-card__color-dot"
              style={{ backgroundColor: car.color.toLowerCase() }}
            />
            {car.color}
          </span>
        </div>
      </div>
    </article>
  );
}
