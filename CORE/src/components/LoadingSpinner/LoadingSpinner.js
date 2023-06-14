import React from "react";
import "./Style.scss";

import { HashLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
  alignContent: "center",
};

export default function LoadingSpinner() {
  return (
    <div className="fullheight xc">
      <div className="child">
        <HashLoader
          color="#367bd6"
          loading={true}
          cssOverride={override}
          size={80}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <br />
        <br />
        {/* <img src={Logo} width={100}></img> */}
      </div>
    </div>
  );
}
