import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const tripList = useSelector((state) => state.user.tripList);
  const dispatch = useDispatch();

  const API_URL = import.meta.env.VITE_API_URL; // Use import.meta.env for Vite

  const getTripList = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/trips`, {
        method: "GET",
      });

      const data = await response.json();
      dispatch(setTripList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Trip List Failed!", err.message);
    }
  };

  useEffect(() => {
    getTripList();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Header />
      <section className="max-padd-container h-full pt-10">
        <h3 className="h3 text-white">Your Trip List</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tripList?.map(
            ({
              listingId,
              hostId,
              startDate,
              endDate,
              totalPrice,
              title,
              description,
              booking = true,
            }) => (
              <ListingCard
                key={listingId}
                listingId={listingId._id}
                creator={hostId._id}
                listingPhotoPaths={listingId.listingPhotoPaths}
                city={listingId.city}
                province={listingId.province}
                country={listingId.country}
                category={listingId.category}
                startDate={startDate}
                endDate={endDate}
                totalPrice={totalPrice}
                title={listingId.title}
                description={listingId.description}
                booking={booking}
              />
            )
          )}
        </div>
      </section>
    </>
  );
};

export default TripList;
