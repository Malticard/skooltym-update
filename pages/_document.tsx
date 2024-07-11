import { Html, Head, Main, NextScript } from 'next/document';
import React from "react";
export default function Document() {
  React.useEffect(() => {
    console.log("5");
  });
  return (
    <Html lang="en" >
      <Head>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
