import React from "react";
import { Oval } from "react-loader-spinner";

const ContentLoader = () => {
  return (
    <div className="w-full flex justify-center items-center h-96">
      <Oval
        height={80}
        width={80}
        color="#000000"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#e5e7eb"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};

export default ContentLoader;
