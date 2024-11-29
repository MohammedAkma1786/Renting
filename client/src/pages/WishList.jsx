import React from "react";
import { useSelector } from "react-redux";
import ListingCard from "../components/ListingCard";
import Header from "../components/Header";

const WishList = () => {
  const wishList = useSelector((state) => state.user.wishList);
  return (
    <>
      <Header />
      <section className="max-padd-container h-full pt-10">
        <h3 className="h3 text-white">Your Wish List</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishList?.map(({ _id, creator, listingPhotoPaths, city, province, country, category, type, price, title, description, booking = false }) => (
            <ListingCard
              key={_id}
              listingId={_id}
              creator={creator}
              listingPhotoPaths={listingPhotoPaths}
              city={city}
              province={province}
              country={country}
              category={category}
              type={type}
              price={price}
              title={title}
              description={description}
              booking={booking}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default WishList;
