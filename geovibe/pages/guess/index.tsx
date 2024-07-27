import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import RenderMap from "@/map_components/RenderMap";
import dynamic from "next/dynamic";
import Navbar from "@/navbar_components/navbar";
import italy_photo from '@/fixtures/italy_photo.jpeg'

const inter = Inter({ subsets: ["latin"] });

export default function Guess() {

    const EsriMap = dynamic(() => import("@/map_components/RenderMap"), { ssr: false });
    return (
        <>
        <div className="card bg-base-100 w-full">
            <div className="grid grid-cols-4">
                <div className="col-span-1 place-items-center card bg-base-100">
                    <figure className="h-96">
                        <Image src={italy_photo} alt="Italy"/>
                    </figure>
                    <h1 className="text-3xl">
                        @Jalen
                    </h1>
                    <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Guesses Remaining</div>
                        <div className="stat-value place-self-center">3</div>
                    </div>
                    </div>
                    <div className="join mt-3">
                        <button className="join-item btn btn-outline">Prev</button>
                        <button className="join-item btn btn-outline">Next</button>
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="card bg-base-100">
                        <EsriMap />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
