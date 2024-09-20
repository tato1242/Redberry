interface Listing {
  id: number;
  image: string;
  price: number;
}

interface SliderProps {
  listings: Listing[];
  onSelectListing: (id: number) => void;
}

const Slider: React.FC<SliderProps> = ({ listings, onSelectListing }) => {
  if (!listings || !Array.isArray(listings)) {
    return <div>No listings available</div>;
  }

  return (
    <div className="slider-container">
      {listings.map((listing) => (
        <div key={listing.id} className="slider-item" onClick={() => onSelectListing(listing.id)}>
          <img src={listing.image} alt="Listing" />
          <p>{listing.price} ₾</p>
        </div>
      ))}
    </div>
  );
};

export default Slider;
