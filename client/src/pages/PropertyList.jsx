import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import ListingCard from "../components/ListingCard";
import { setPropertyList } from "../redux/state";
import Loader from "../components/Loader";

const PropertyList = () => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const propertyList = user?.propertyList;
  const dispatch = useDispatch();

  const API_URL = process.env.REACT_APP_API_URL; // Use the environment variable

  const getPropertyList = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${user._id}/listing`, {
        method: "GET",
      });
      const data = await response.json();
      dispatch(setPropertyList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch all properties failed", err.message);
    }
  };

  useEffect(() => {
    getPropertyList();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Header />
      <section className="max-padd-container pt-10">
        <h3 className="h3">Your Property List</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {propertyList?.map(
            ({
              _id,
              creator,
              listingPhotoPaths,
              city,
              province,
              country,
              category,
              type,
              price,
              title,
              description,
              booking = false,
            }) => (
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
            )
          )}
        </div>
      </section>
    </>
  );
};

export default PropertyList;
