import Head from "next/head";
// import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import RenderMap from "@/map_components/RenderMap";
import dynamic from "next/dynamic";
import Navbar from "@/navbar_components/navbar";
import { useState, useEffect, useRef } from "react";
import { Exifr } from "exifr";
import EXIF from 'exif-js';
import * as ExifReader from 'exifreader';
import { Buffer } from 'buffer';


const inter = Inter({ subsets: ["latin"] });

export default function Post() {
    const [geolocation, setGeolocation] = useState("");
    const [longitude, setLongitude] = useState(null)
    const [latitude, setLatitude] = useState(null)
    const [imageUploaded, setimageUploaded] = useState("");
    const [buffer, setBuffer] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null);
    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);

    const fetchImageAndConvertToBuffer = async (url) => {
      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error("Failed to fetch image");
          }
          const arrayBuffer = await response.arrayBuffer();
          const buffer = await Buffer.from(arrayBuffer);
          return buffer
      } catch (error) {
          console.error("Error fetching and converting image:", error);
      }
  };


    useEffect(() => {
      console.log(imageUploaded)
      const getMetadata = async () => {
        const buffer = await fetchImageAndConvertToBuffer(imageUploaded);
        console.log(buffer);
        const tags = await ExifReader.load(buffer as any);
        console.log(tags)
        if(tags['GPSLatitudeRef']['value'][0] === 'S') {
          setLatitude(-tags['GPSLatitude'].description);
        }
        else {
          setLatitude(tags['GPSLatitude'].description);
        }
        if(tags['GPSLongitudeRef']['value'][0] === 'W') {
          setLongitude(-tags['GPSLongitude'].description);
        }
        else {
          setLongitude(tags['GPSLongitude'].description);
        }
      }
      if (imageUploaded) {
        console.log(imageUploaded);
        getMetadata()
      }
      console.log(imageUploaded);
      // const lat = EXIF.getTag(this, 'GPSLatitude');
      console.log("hello");
    }, [imageUploaded, buffer])

    function pad2(n : number) { return n < 10 ? '0' + n : n }
    var date = new Date();

    const EsriMap = dynamic(() => import("@/map_components/RenderMap"), { ssr: false }); 
    
    const distances = [
      '50ft',
      '100ft',
      '500ft',
      '1/2mi',
      '1mi',
      '5mi',
      '10mi',
      '20mi',
      '50mi',
      '100mi'
    ]
    
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

    const handleImageUpload = (e) => {
      if (!e.target.files || e.target.files.length === 0) {
        setSelectedFile(null)
        return
    }
    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
  }

  useEffect(() => {
    if (!selectedFile) {
        setimageUploaded("")
        return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    console.log(objectUrl);
    setimageUploaded(objectUrl);

    // // free memory when ever this component is unmounted
    // return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile])
  return (
    <div className="card bg-base-100 w-full mx-6 shadow-xl">
      <div className="card-body grid grid-cols-4">
        <div className="card-title justify-self-center col-span-4">
          <h1 className="text-4xl">Create Post</h1>
          {/* {latitude && <h1>{latitude}</h1>}
          {longitude && <h1>{longitude}</h1>} */}
        </div>
        <div className="col-span-2 grid grid-cols-subgrid">
          <label className="form-control w-full col-span-2">
            <div className="label">
              <span className="label-text">Caption</span>
            </div>
            <textarea className="textarea textarea-bordered" placeholder="Caption"></textarea>
            <div className="label">
            </div>
          </label>
          <label className="form-control col-span-1">
            <div className="label">
              <span className="label-text">How close does the guess need to be</span>
            </div>
            <select className="select select-bordered ">
              {distances.map((distance) => {
                return (
                  <option key="distance" value={distance}>{distance}</option>
                )
              })}
            </select>
          </label>
          <label className="form-control col-span-1">
            <div className="label">
              <span className="label-text"># of Guesses per Hour</span>
            </div>
            <input type="number" max="10" min="1" step="1" placeholder="Type here" className="input input-bordered max-w-full" />
          </label>
          {latitude && 
          <label className="form-control col-span-1">
              <div className="label">
                <span className="label-text">Latitude</span>
              </div>
              <input value={latitude} disabled type="text" placeholder="Write your title" className="input input-bordered w-full max-w-xs" />
          </label>
          }
          {longitude && 
          <label className="form-control col-span-1">
              <div className="label">
                <span className="label-text">Longitude</span>
              </div>
              <input value={longitude} disabled type="text" placeholder="Write your title" className="input input-bordered w-full max-w-xs" />
          </label>
          }
          <div className="col-span-2 mt-6 mb-20">
            {
              imageUploaded && longitude && latitude &&
              <EsriMap start_x={longitude} start_y={latitude}/>
            }
          </div>
        </div>
        <div className="col-span-2 justify-self-center">
          {
          imageUploaded && 
          <figure className="h-96">
            <img src={imageUploaded} alt="image" width={400} height={600} className="mt-6"></img>
          </figure>
          }
          <label className="form-control w-full max-w-xs ">
            <div className="label" >
                  <span className="label-text">Upload Your Photo</span>
            </div>
            <input
              type="file"
              className="file-input file-input-bordered file-input-primary w-full max-w-xs"
              onChange={handleImageUpload} 
              />
          </label>
        </div>
        <div className="col-span-4 w-full mt-6">
          <button className="btn w-full btn-primary" disabled={!imageUploaded}>
            Post
          </button>
        </div>
      </div>
      {/* <div>
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
      </div> */}
      
    </div>
  );
}
