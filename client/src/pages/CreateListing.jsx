import React, { useState } from "react";
import { categories, facilities, types } from "../assets/data";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { BiTrash } from "react-icons/bi";
import { IoIosImages } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaMinus, FaPlus } from "react-icons/fa6";
import Header from "../components/Header";

const CreateListing = ({
  initialPhotos = [],
  initialCategory = "",
  initialType = "",
  initialAmenities = [],
  initialStreetAddress = "",
  initialAptSuite = "",
  initialCity = "",
  initialProvince = "",
  initialCountry = "",
  initialGuestCount = 1,
  initialBedroomCount = 1,
  initialBedCount = 1,
  initialBathroomCount = 1,
  initialTitle = "",
  initialDescription = "",
  initialPrice = 0,
}) => {
  const [photos, setPhotos] = useState(initialPhotos);
  const [category, setCategory] = useState(initialCategory);
  const [type, setType] = useState(initialType);
  const [amenities, setAmenities] = useState(initialAmenities);
  const navigate = useNavigate();

  // LOCATION
  const [formLocation, setFormLocation] = useState({
    streetAddress: initialStreetAddress,
    aptSuite: initialAptSuite,
    city: initialCity,
    province: initialProvince,
    country: initialCountry,
  });

  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setFormLocation({
      ...formLocation,
      [name]: value,
    });
  };

  // BASIC COUNT
  const [guestCount, setGuestCount] = useState(initialGuestCount);
  const [bedroomCount, setBedroomCount] = useState(initialBedroomCount);
  const [bedCount, setBedCount] = useState(initialBedCount);
  const [bathroomCount, setBathroomCount] = useState(initialBathroomCount);

  // AMENITIES
  const handleSelectAmenities = (facility) => {
    if (amenities.includes(facility)) {
      setAmenities((prevAmenities) =>
        prevAmenities.filter((option) => option !== facility)
      );
    } else {
      setAmenities((prev) => [...prev, facility]);
    }
  };

  // DESCRIPTION
  const [formDescription, setFormDescription] = useState({
    title: initialTitle,
    description: initialDescription,
    price: initialPrice,
  });

  const handleChangeDescription = (e) => {
    const { name, value } = e.target;
    setFormDescription({
      ...formDescription,
      [name]: value,
    });
  };

  const handleUploadPhotos = (e) => {
    const newPhotos = e.target.files;
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };

  const handleDragPhoto = (result) => {
    if (!result.destination) return;
    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPhotos(items);
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    );
  };

  const creatorId = useSelector((state) => state.user._id);
  const API_URL = process.env.REACT_APP_API_URL; // Use the environment variable

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const listingForm = new FormData();
      listingForm.append("creator", creatorId);
      listingForm.append("category", category);
      listingForm.append("type", type);
      listingForm.append("streetAddress", formLocation.streetAddress);
      listingForm.append("aptSuite", formLocation.aptSuite);
      listingForm.append("city", formLocation.city);
      listingForm.append("province", formLocation.province);
      listingForm.append("country", formLocation.country);
      listingForm.append("guestCount", guestCount);
      listingForm.append("bedroomCount", bedroomCount);
      listingForm.append("bedCount", bedCount);
      listingForm.append("bathroomCount", bathroomCount);
      listingForm.append("amenities", amenities);
      listingForm.append("title", formDescription.title);
      listingForm.append("description", formDescription.description);
      listingForm.append("price", formDescription.price);

      // Append each selected photo to the FormData object
      photos.forEach((photo) => {
        listingForm.append("listingPhotos", photo);
      });

      // Send a POST request to the server
      const response = await fetch(`${API_URL}/listing/create`, {
        method: "POST",
        body: listingForm,
      });

      if (response.ok) {
        navigate("/");
      }
    } catch (err) {
      console.log("Publish Listing Failed", err.message);
    }
  };

  return (
    <>
      <Header />
      <section className="max-padd-container py-10 text-secondary">
        <h3 className="h3 text-secondary">Add a Property</h3>
        <form onSubmit={handlePost} className="mt-10">
          <h4 className="h4 my-4 text-secondary">Describe your Property?</h4>
          <div className="hide-scrollbar flex gap-x-1 bg-white ring-1 ring-slate-400/5 shadow-sm rounded-full px-2 py-3 overflow-x-auto mb-8">
            {categories.map((item) => (
              <div
                key={item.label}
                onClick={() => setCategory(item.label)}
                className="flexCenter flex-col gap-2 p-2 rounded-xl cursor-pointer min-w-24 xl:min-w-32"
                style={{ flexShrink: 0 }} // Prevent shrinking
              >
                <div
                  className="text-primary rounded-full h-10 w-10 p-2 flexCenter text-lg"
                  style={{ backgroundColor: `${item.color}` }}
                >
                  {item.icon}
                </div>
                <p
                  className={`${
                    category === item.label ? "text-sun-yellow" : ""
                  } medium-14`}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          {/* container Types and Loacations */}
          <div className="flex flex-col xl:flex-row gap-x-16 bg-muted">
            <div className="flex-1">
              {/* type of place */}
              <h4 className="h4 my-4 pl-4">What is the type of your place?</h4>
              <div className="flex flex-col gap-y-3 mb-6 pl-4">
                {types.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => setType(item.name)}
                    className={`${
                      type === item.name
                        ? "ring-2 ring-slate-950 bg-white"
                        : "ring-2 ring-white"
                    } flexBetween max-w-[777px] rounded-xl px-4 py-1 bg-secondary`}
                  >
                    <div>
                      <h5 className="h5">{item.name}</h5>
                      <p>{item.description}</p>
                    </div>
                    <div className="text-2xl text-primary ">{item.icon}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* place location */}
            <div className="flex-1 mb-4">
              <h4 className="h4 my-4">What's the address of your place??</h4>
              <div>
                <div>
                  <h5 className="h5">Street Address:</h5>
                  <input
                    onChange={handleChangeLocation}
                    value={formLocation.streetAddress}
                    type="text"
                    name="streetAddress"
                    placeholder="Street"
                    required
                    className="bg-white text-black p-2 text-sm outline-none border-none mb-2 rounded"
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-1/2">
                  <h5 className="h5">Apartment, Suite (opt):</h5>
                  <input
                    onChange={handleChangeLocation}
                    value={formLocation.aptSuite}
                    type="text"
                    name="aptSuite"
                    placeholder="Apt, Suite"
                    required
                    className="bg-white text-black p-2 text-sm outline-none border-none mb-2 rounded"
                  />
                </div>
                <div className="w-1/2">
                  <h5 className="h5">City:</h5>
                  <input
                    onChange={handleChangeLocation}
                    value={formLocation.city}
                    type="text"
                    name="city"
                    placeholder="City"
                    required
                    className="bg-white text-black p-2 text-sm outline-none border-none mb-2 rounded"
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-1/2">
                  <h5 className="h5">Province:</h5>
                  <input
                    onChange={handleChangeLocation}
                    value={formLocation.province}
                    type="text"
                    name="province"
                    placeholder="Province"
                    required
                    className="bg-white text-black p-2 text-sm outline-none border-none mb-2 rounded"
                  />
                </div>
                <div className="w-1/2">
                  <h5 className="h5">Country:</h5>
                  <input
                    onChange={handleChangeLocation}
                    value={formLocation.country}
                    type="text"
                    name="country"
                    placeholder="Country"
                    required
                    className="bg-white text-black p-2 text-sm outline-none border-none mb-2 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* some basics */}
          <h4 className="h4 my-4 text-white mt-10">
            Provide some essential details about your place?
          </h4>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flexCenter gap-x-4 ring-1 ring-slate-900/5 p-2 rounded">
              <h5>Guests</h5>
              <div className="flexCenter gap-x-2 bg-white">
                <FaMinus
                  onClick={() => {
                    guestCount > 1 && setGuestCount(guestCount - 1);
                  }}
                  className="h-6 w-6 text-xl p-1 rounded cursor-pointer"
                />
                <p>{guestCount}</p>
                <FaPlus
                  onClick={() => setGuestCount(guestCount + 1)}
                  className="h-6 w-6 text-xl bg-secondary text-white p-1 rounded cursor-pointer"
                />
              </div>
            </div>
            <div className="flex gap-x-4 ring-1 ring-slate-900/5 p-2 rounded">
              <h5>Bedrooms</h5>
              <div className="flexCenter gap-x-2 bg-white">
                <FaMinus
                  onClick={() => {
                    bedroomCount > 1 && setBedroomCount(bedroomCount - 1);
                  }}
                  className="h-6 w-6 text-xl p-1 rounded cursor-pointer"
                />
                <p>{bedroomCount}</p>
                <FaPlus
                  onClick={() => setBedroomCount(bedroomCount + 1)}
                  className="h-6 w-6 text-xl bg-secondary text-white p-1 rounded cursor-pointer"
                />
              </div>
            </div>
            <div className="flex gap-x-4 ring-1 ring-slate-900/5 p-2 rounded">
              <h5>Beds</h5>
              <div className="flexCenter gap-x-2 bg-white">
                <FaMinus
                  onClick={() => {
                    bedCount > 1 && setBedCount(bedCount - 1);
                  }}
                  className="h-6 w-6 text-xl p-1 rounded cursor-pointer"
                />
                <p>{bedCount}</p>
                <FaPlus
                  onClick={() => setBedCount(bedCount + 1)}
                  className="h-6 w-6 text-xl bg-secondary text-white p-1 rounded cursor-pointer"
                />
              </div>
            </div>
            <div className="flex gap-x-4 ring-1 ring-slate-900/5 p-2 rounded">
              <h5>Bathrooms</h5>
              <div className="flexCenter gap-x-2 bg-white">
                <FaMinus
                  onClick={() => {
                    bathroomCount > 1 && setBathroomCount(bathroomCount - 1);
                  }}
                  className="h-6 w-6 text-xl p-1 rounded cursor-pointer"
                />
                <p>{bathroomCount}</p>
                <FaPlus
                  onClick={() => setBathroomCount(bathroomCount + 1)}
                  className="h-6 w-6 text-xl bg-secondary text-white p-1 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="my-10">
            <h4 className="h4 my-4 text-white">
              Describe about the features of your location?
            </h4>
            <ul className="flex items-center flex-wrap gap-4 mb-10  ">
              {facilities?.map((card) => (
                <li
                  key={card.name}
                  onClick={() => handleSelectAmenities(card.name)}
                  className={`${
                    amenities.includes(card.name)
                      ? "ring-2 ring-secondary"
                      : "ring-1 ring-slate-900/5"
                  } flex items-center gap-3 bg-muted text-white p-4 rounded cursor-default`}
                >
                  <div>{card.icon}</div>
                  <p className="text-white">{card.name}</p>
                </li>
              ))}
            </ul>

            {/* Upload Images */}
            <h4 className="h4 mt-20 text-white">
              Include images showcasing your property?
            </h4>
            <DragDropContext onDragEnd={handleDragPhoto}>
              <Droppable droppableId="photos" direction="horizontal">
                {(provided) => (
                  <div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg shadow-lg"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {photos.length < 1 && (
                      <>
                        <input
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                          id="imageUpload"
                          className="hidden"
                        />
                        <label
                          htmlFor="imageUpload"
                          className="group flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-muted transition-colors cursor-pointer"
                        >
                          <div className="h-52 w-full flex items-center justify-center">
                            <IoIosImages className="text-6xl text-gray-400 group-hover:text-gray-600 transition-colors" />
                          </div>
                          <p className="text-gray-500 group-hover:text-gray-700">
                            Upload from your device
                          </p>
                        </label>
                      </>
                    )}
                    {photos.length >= 1 && (
                      <>
                        {photos.map((photo, index) => {
                          return (
                            <Draggable
                              key={index}
                              draggableId={index.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="relative group"
                                >
                                  <img
                                    src={URL.createObjectURL(photo)}
                                    alt="property"
                                    className="aspect-square object-cover h-52 w-full rounded-lg shadow-md"
                                  />
                                  <button
                                    type="button"
                                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-200 transition"
                                    onClick={() => handleRemovePhoto(index)}
                                  >
                                    <BiTrash className="text-red-600" />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        <input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                          className="hidden"
                        />
                        <label
                          htmlFor="imageUpload"
                          className="group flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className="h-52 w-full flex items-center justify-center">
                            <IoIosImages className="text-6xl text-gray-400 group-hover:text-gray-600 transition-colors" />
                          </div>
                          <p className="text-gray-500 group-hover:text-gray-700">
                            Upload more photos
                          </p>
                        </label>
                      </>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <h4 className="h4 my-5 text-white">
              How would you characterize the charm and excitement of your
              property?
            </h4>
            <div>
              <input
                type="text"
                value={formDescription.title}
                onChange={handleChangeDescription}
                name="title"
                placeholder="Title"
                required
                className="bg-white text-black p-2 text-sm outline-none border-none mb-2 rounded w-full"
              />
              <textarea
                type="text"
                rows={10}
                value={formDescription.description}
                onChange={handleChangeDescription}
                name="description"
                placeholder="Description"
                required
                className="bg-white text-black p-2 text-sm outline-none border-none mb-2 rounded w-full resize-none"
              />
              <h5 className="h5 text-white">Price Per Night:</h5>
              <input
                type="number"
                value={formDescription.price}
                onChange={handleChangeDescription}
                name="price"
                placeholder="$100"
                required
                className="bg-white text-black p-2 text-sm outline-none border-none mb-2 rounded"
              />
            </div>
          </div>
          <button className="btn-secondary rounded-full" type="submit">
            Create Property
          </button>
        </form>
      </section>
    </>
  );
};

export default CreateListing;
