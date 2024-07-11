import { Html, Head, Main, NextScript } from 'next/document';
import React from "react";
export default function Document() {
  React.useEffect(() => {
    console.log("5");
  });
  return (
    <Html lang="en" >
      <Head>
        <link rel="stylesheet" href="/assets/css/app.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
