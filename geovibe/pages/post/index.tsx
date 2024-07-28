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
import  createSupabaseClient  from "@/lib/supabaseclient";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";

const inter = Inter({ subsets: ["latin"] });

export default function Post() {
    const [geolocation, setGeolocation] = useState("");
    const [longitude, setLongitude] = useState<String | number | null>(null)
    const [latitude, setLatitude] = useState<String | number | null>(null)
    const [imageUploaded, setimageUploaded] = useState("");
    const [buffer, setBuffer] = useState(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);
    const [descr, setDescr] = useState("")
    const [guesses, setguesses] = useState<string>("")
    const [dist, setdist] = useState<number>(0);
    const [pointGraphic, setpg] = useState<Graphic | null>(null)
    
    const fetchImageAndConvertToBuffer = async (url : any) => {
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
        const latref = tags['GPSLatitudeRef'] as any
        if(latref['value'][0] === 'S') {
          tags['GPSLatitude'] != undefined? setLatitude(-tags['GPSLatitude'].description) : null;
        }
        else {
          tags['GPSLatitude'] != undefined? setLatitude(tags['GPSLatitude'].description) : null;
        }
        const longref = tags['GPSLatitudeRef'] as any
        if(longref['value'][0] === 'W') {
          tags['GPSLongitude'] != undefined? setLongitude(-tags['GPSLongitude'].description) : null;
        }
        else {
          tags['GPSLongitude'] != undefined? setLongitude(tags['GPSLongitude'].description) : null;
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
      { value: 0.00947, label: '50ft' },
      { value: 0.019, label: '100ft' },
      { value: 0.095, label: '500ft' },
      { value: 0.5, label: '1/2mi' },
      { value: 1, label: '1mi' },
      { value: 5, label: '5mi' },
      { value: 10, label: '10mi' },
      { value: 20, label: '20mi' },
      { value: 50, label: '50mi' },
      { value: 100, label: '100mi' }
    ];
    const distRef = useRef(null)
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

    const pushToDatabase = async () => {
      const supabase = createSupabaseClient();
      console.log("descr : ", descr);
      console.log("guesses : ", guesses);
      const img = fetchImageAndConvertToBuffer(imageUploaded)
      console.log("file name : ", selectedFile!.name)
      const curr_filename = selectedFile!.name;
      // const {data} = supabase.storage.from('user-images').getPublicUrl("abird/AmsAmber.HEIC");
      // console.log("data: ", data['publicUrl']);

      // return data["publicUrl"]


    const res = await supabase
          .storage
          .from('user-images')
          .upload('annam/'+ curr_filename, selectedFile!, {
            cacheControl: '3600',
            upsert: false
          })
          console.log(res)
          
          console.log("DISTANCE", dist)

     const data =  await supabase.from('Posts').insert({
        created_by : "annam",
        title : "new title",
        description : descr,
        latitude : latitude,
        longitude : longitude,
        pic_uri : "annam/" + curr_filename,
        guesses_max : parseInt(guesses),
        category : currentCategory,
        distance : dist
      })
      console.log(data);
    }

    const saveCategory = (category : string) => {
        setCurrentCategory(category);

    }
    
    const mapRef = useRef(null);

    const handleImageUpload = (e : any) => {
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
    console.log("pic url : ",objectUrl);
    setimageUploaded(objectUrl);

    // // free memory when ever this component is unmounted
    // return () => URL.revokeObjectURL(objectUrl);
    console.log("lat in post: ",longitude)
    console.log(latitude)
    const point = new Point({
      longitude: longitude as number,
      latitude: latitude as number
  });
  
      const markerSymbol = {
          type: "simple-marker", // Use a simple marker symbol
          color: [226, 119, 40], // Set marker color
          outline: {
          color: [255, 255, 255], // Set outline color
          width: 2
          }
      };
      
      setpg( new Graphic({
          geometry: point,
          symbol: markerSymbol
      }));

  }, [selectedFile,longitude, latitude])
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
            <textarea id="post-descr" className="textarea textarea-bordered" placeholder="Caption" onChange={(e) => setDescr(e.target.value)}></textarea>
            <div className="label">
            </div>
          </label>
          <label className="form-control col-span-1">
            <div className="label">
              <span className="label-text">How close does the guess need to be</span>
            </div>
            <select ref={distRef} className="select select-bordered" onClick={(e) => {
              setdist(e.target.value)
              console.log(e.target.value)
            }}>
              {distances.map((distance) => {
                return (
                  <option key={distance.value} value={distance.value}>{distance.label}</option>
                )
              })}
            </select>
          </label>

          <label className="form-control col-span-1">
            <div className="label">
              <span className="label-text"># of Guesses per Hour</span>
            </div>
            <input onChange = {(e) => {setguesses(e.target.value)}} id="guesses-comp" type="number" max="10" min="1" step="1" placeholder="Type here" className="input input-bordered max-w-full" />
          </label>
          <div id= "dropdowncat" className="dropdown col-span-2">
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
          <li onClick={() => saveCategory("Other")}><a>Other</a></li>
        </ul>
      </div>

          {latitude && 
          <label className="form-control col-span-1">
              <div className="label">
                <span className="label-text">Latitude</span>
              </div>
              <input value={latitude as number} disabled type="text" placeholder="Write your title" className="input input-bordered w-full max-w-xs" />
          </label>
          }
          {longitude && 
          <label className="form-control col-span-1">
              <div className="label">
                <span className="label-text">Longitude</span>
              </div>
              <input value={longitude as number} disabled type="text" placeholder="Write your title" className="input input-bordered w-full max-w-xs" />
          </label>
          }
          <div className="col-span-2 mt-6 mb-20">
            {
              imageUploaded && longitude && latitude &&
              <EsriMap user_x={null}  start_x={longitude as number} post_x_coord = {null} post_y_coord={null} start_y={latitude as number} point_ref={pointGraphic} total_guesses={null}/>
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
          <button  onClick={() => pushToDatabase()} className="btn w-full btn-primary" disabled={!imageUploaded}>
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
