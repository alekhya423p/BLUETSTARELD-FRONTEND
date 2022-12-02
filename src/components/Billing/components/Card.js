import React from "react";
import { CardElement } from "@stripe/react-stripe-js";

export const Card = () => {
  const options = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "inherit",
        fontSmoothing: "antialiased",
        fontSize: "inherit",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <div className="InputFields">
      <div className="InputField StripeEl">
        {/* <label className="label mb-0"> Credit Card </label>{" "} */}
        <CardElement hidePostalCode options={options} />{" "}
      </div>{" "}
    </div>
  );
};

export default Card;
