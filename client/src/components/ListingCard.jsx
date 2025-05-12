import "../styles/ListingCard.scss"
import { ArrowforwardIos, ArrowBackIosNew, ArrowForwardIos, Favorite } from "@mui/icons-material"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setWishList } from "../redux/state";

import { format } from "date-fns";
import { enUS } from "date-fns/locale";

const formattedDate = format(new Date(), "PP", { locale: enUS });

const ListingCard = ({
    listingId,
    creator,
    listingPhotoPaths,
    city,
    province,
    country,
    category,
    type,
    title,
    price,
    startDate,
    endDate,
    totalPrice,
    booking,
}) => {

    /*Slider for images */
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevSlide = () => {
        setCurrentIndex(
            (prevIndex) =>
                (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
        )
    }

    const goToNextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length)
    }

    const navigate = useNavigate();
    const dispatch = useDispatch();

    /* ADD TO WISHLIST */
    const user = useSelector((state) => state.user);
    const wishList = user?.wishList || [];

    const isLiked = wishList?.find((item) => item?._id === listingId);

    const patchWishList = async () => {
        if (user?._id !== creator._id) {
            const response = await fetch(
                `http://localhost:3001/users/${user?._id}/${listingId}`,
                {
                    method: "PATCH",
                    header: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            dispatch(setWishList(data.wishList));
        } else { return }
    };
    //fix?
    console.log({ listingId, startDate, endDate, listingPhotoPaths, creator });
    return (
        <div
          className="listing-card"
          onClick={() => {
            if (listingId) {
                navigate(`/properties/${listingId}`);
              } else {
                console.error("Invalid listingId");
              }
          }}
        >
          <div className="slider-container">
            <div
              className="slider"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {listingPhotoPaths?.map((photo, index) => (
                <div key={index} className="slide">
                  <img
                    src={`http://localhost:3001/${photo?.replace("public", "")}`}
                    alt={`photo ${index + 1}`}
                  />
                  <div
                    className="prev-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevSlide(e);
                    }}
                  >
                    <ArrowBackIosNew sx={{ fontSize: "15px" }} />
                  </div>
                  <div
                    className="next-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNextSlide(e);
                    }}
                  >
                    <ArrowForwardIos sx={{ fontSize: "15px" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
    
          <h3>{category}</h3>
          <p>{city}, {province}, {country}</p>
    
          {!booking ? (
            <>
              <p>{type}</p>
              <p>
                <span>₹{price}</span> per day
              </p>
            </>
          ) : (
            <>
              <p>
                {startDate} - {endDate}
              </p>
              <p>
                <span>₹{totalPrice}</span> total
              </p>
            </>
          )}

          <button
            className="favorite"
            onClick={(e) => {
              e.stopPropagation();
              patchWishList();
            }}
            disabled={!user}
          >
            {isLiked ? (
              <Favorite sx={{ color: "red" }} />
            ) : (
              <Favorite sx={{ color: "white" }} />
            )}
          </button>
        </div>
      );
    };
    
    export default ListingCard;