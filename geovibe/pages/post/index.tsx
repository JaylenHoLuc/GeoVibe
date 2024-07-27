import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import RenderMap from "@/map_components/RenderMap";
import dynamic from "next/dynamic";
import Navbar from "@/navbar_components/navbar";
import { useEffect, useRef, useState } from "react";


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
    
    const [currentCategory, setCurrentCategory] = useState("Select category");
    const handleSubmit = () => {

    }
    const saveCategory = (category : string) => {
        setCurrentCategory(category);

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

      <div id= "dropdowncat" className="dropdown dropdown-top">
        <div tabIndex={0} role="button" className="btn m-1">{currentCategory}</div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          <li onClick={() => saveCategory("Nature")}><a>Nature</a></li>
          <li onClick={() => saveCategory("Travel")}><a>Travel</a></li>
          <li onClick={() => saveCategory("Food")}><a>Food</a></li>
          <li onClick={() => saveCategory("The Arts")}><a>The Arts</a></li>
          <li onClick={() => saveCategory("Music")}><a>Music</a></li>
          <li onClick={() => saveCategory("Event")}><a>Event</a></li>
          <li onClick={() => saveCategory("Architecture")}><a>Architecture</a></li>
          <li onClick={() => saveCategory("Sport")}><a>Sport</a></li>
        </ul>
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
