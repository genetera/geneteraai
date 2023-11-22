import React from "react";
import Head from "next/head";
const _document = () => {
  return (
    <Head>
      {/* preconnect scripts... */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
    </Head>
  );
};

export default _document;
