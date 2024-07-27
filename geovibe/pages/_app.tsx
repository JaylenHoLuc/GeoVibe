//import Layout from '../components/layout'
import '@/styles/globals.css'
import Head from "next/head";
import Navbar from '@/navbar_components/navbar';
export default function MyApp({ Component, pageProps } : any) {
  return (
    <>
      <Navbar></Navbar>
      <Component {...pageProps} />
    </>
  )
}