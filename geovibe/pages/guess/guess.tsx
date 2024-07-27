import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import RenderMap from "@/map_components/RenderMap";
import dynamic from "next/dynamic";
import Navbar from "@/navbar_components/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function Guess() {
    const EsriMap = dynamic(() => import("@/map_components/RenderMap"), { ssr: false });
    return (
        <>
            <h1>Guess Page</h1>
            <EsriMap />
        </>
    );
}
