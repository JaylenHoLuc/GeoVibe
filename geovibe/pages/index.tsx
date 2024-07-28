import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import RenderMap from "@/map_components/RenderMap";
import dynamic from "next/dynamic";
import Navbar from "@/navbar_components/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const EsriMap = dynamic(() => import("@/map_components/RenderMap"), { ssr: false });
  return (
    <>
        <EsriMap start_x={-118.80500} start_y={34.02700} point_ref={null}/>
    </>
  );
}
