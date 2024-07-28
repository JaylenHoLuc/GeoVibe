//import Layout from '../components/layout'
import '@/styles/globals.css'
import Head from "next/head";
import Navbar from '@/navbar_components/navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyApp({ Component, pageProps } : any) {
  return (
    <>
      <Navbar></Navbar>
      <ToastContainer />
      <Component {...pageProps} />
    </>
  )
}