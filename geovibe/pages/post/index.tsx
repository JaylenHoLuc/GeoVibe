import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import RenderMap from "@/map_components/RenderMap";
import dynamic from "next/dynamic";
import Navbar from "@/navbar_components/navbar";
import { useEffect, useRef } from "react";


const inter = Inter({ subsets: ["latin"] });

export default function Post() {

    function pad2(n : number) { return n < 10 ? '0' + n : n }
    var date = new Date();
    
    function get_timestamp() {

      return (date.getFullYear().toString() + "-" +
      pad2(date.getMonth() + 1) + "-" +
      pad2( date.getDate()) + "-" +
      pad2( date.getHours() ) + ":" +
      pad2( date.getMinutes() ) + ":" +
      pad2( date.getSeconds() ));
    }
  
    const handleSubmit = () => {

    }
    const mapRef = useRef(null);

    useEffect(() => {
 
   
    },[]);

  return (
    <div className="grid grid-cols-1 gap-4 ">
      <div>
        <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Title</span>
            </div>
            <input type="text" placeholder="Write your title" className="input input-bordered w-full max-w-xs" />
            <div className="label">
            </div>
        </label>
      </div>

      <div>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Description</span>
          </div>
          <input type="text" placeholder="Write your description" className="input input-bordered w-full max-w-xs" />
          <div className="label">
          </div>
        </label>
      </div>

      <div>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Username</span>
          </div>
          <input disabled type="text" placeholder="Write your username" className="input input-bordered w-full max-w-xs" />
          <div className="label">
          </div>
        </label>
      </div>

      <div>
        <label className="form-control w-full max-w-xs ">
          <div className="label" >
            <span className="label-text">Current Time</span>
          </div>
          <input disabled type="text" value={get_timestamp()} className="input input-bordered w-full max-w-xs" />
          <div className="label">
          </div>
        </label>
      </div>

      <div >
      <label className="form-control w-full max-w-xs ">
        <div className="label" >
              <span className="label-text">Upload Your Photo</span>
        </div>
        <input
          type="file"
          className="file-input file-input-bordered file-input-primary w-full max-w-xs" />
      </label>
      </div>
      <div>
        <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Latitude</span>
            </div>
            <input disabled type="text" placeholder="Write your title" className="input input-bordered w-full max-w-xs" />
            <div className="label">
            </div>
        </label>
      </div>
      <div>
        <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Longtitude </span>
            </div>
            <input disabled type="text" placeholder="Write your title" className="input input-bordered w-full max-w-xs" />
            <div className="label">
            </div>
        </label>
      </div>
      
    </div>
  );
}
