
import '../styles/globals.scss'
import '../public/assets/css/icons.css'
import Contentlayout from '../shared/layout-components/layout/content-layout'
import Landingpagelayout from '../shared/layout-components/layout/landingpage-layout'
import Authenticationlayout from '../shared/layout-components/layout/authentication-layout'
import { useRouter } from 'next/navigation'
import React from 'react'

const layouts: any = {
  Contentlayout: Contentlayout,
  Landingpagelayout: Landingpagelayout,
  Authenticationlayout: Authenticationlayout,
};

function MyApp({ Component, pageProps }: { Component: any, pageProps: any }) {

  const Layout: any = layouts[Component.layout] || ((pageProps: any) => <Component>{pageProps}</Component>);
  const router = useRouter();
  React.useEffect(() => {
    let userSession = window.localStorage.getItem("skooltym_user");

    if (userSession === null) {
      router.replace('/', {
        scroll: false,
      });

    } else {
      console.log(userSession);
    }
  }, [100]);
  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default MyApp
