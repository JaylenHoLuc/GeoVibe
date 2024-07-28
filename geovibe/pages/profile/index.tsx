import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import RenderMap from "@/map_components/RenderMap";
import dynamic from "next/dynamic";
import Navbar from "@/navbar_components/navbar";

export default function Profile() {
  const EsriMap = dynamic(() => import("@/map_components/RenderMap"), { ssr: false });

  return (
    <>
      <div className="card bg-base-100 w-full">
        <div className="card-body h-full w-full">
          <div className="grid grid-cols-4 h-full w-full gap-3">
            <div className="col-span-4 place-self-center">
              <div className="avatar">
                <div className="w-64 rounded-full">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
            </div>
            <div className="col-span-2 justify-self-end mx-3">
              <h1 className="text-3xl">
                Sartaj Dua
              </h1>
              <h1 className="text-1xl">
                @sartajdua7
              </h1>
            </div>
            <div className="stats shadow col-span-2 justify-self-start mx-3">
              <div className="stat">
                <div className="stat-title">Friends</div>
                <div className="stat-value">300</div>
              </div>
            </div>
            <div className="col-span-4">
              <EsriMap  user_x = {null} start_x={-118.80500} post_x_coord = {null} post_y_coord = {null} start_y={34.02700} point_ref={null} total_guesses={null}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
