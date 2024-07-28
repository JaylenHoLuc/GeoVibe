import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import RenderMap from "@/map_components/RenderMap";
import dynamic from "next/dynamic";
import Navbar from "@/navbar_components/navbar";
import italy_photo from '@/fixtures/italy_photo.jpeg'
import {getAllPosts} from "@/lib/SupabaseHelper";
import { useRef, useState } from "react";
import createSupabaseClient from "@/lib/supabaseclient";
import { useEffect, useCallback } from 'react';
import {toast} from 'react-toastify';
const inter = Inter({ subsets: ["latin"] });
let EsriMap = dynamic(() => import("@/map_components/RenderMap"), { ssr: false });

export default function Guess() {

    const [allPosts,setAllPosts] = useState<any[] | null>(null);
    const [postIndex,setPostIndex] = useState(0);
    const [image,setImage] = useState('');
    const [dist_val, set_dist_val] = useState(0);
    const [message, setMessage] = useState('Watch the slider track how close you are!');
    
    const [current_guess_dist, setguessdist] = useState(0);

    const [post_x , set_x] = useState(0);

    const [post_y, set_y] = useState(0);
    // const [c_x, set_cx] = useState(0);

    //const [guesses_remaind, set_gr] = useState<number>(0);
    const guesses_remaind = useRef(0)
    const dec = () => {
        if (guesses_remaind){
            console.log("GUESSES : ", guesses_remaind)
            guesses_remaind.current--;
        }
    }
    //const [current_color, set_current_color ] = useState("range range-error");
    const current_color = useRef("range range-error")
    const set_current_color = (c : string) => {
        current_color.current = c
    }
    useEffect(() => {
        EsriMap = dynamic(() => import("@/map_components/RenderMap"), { ssr: false });
    }, [postIndex])
    const c_x = useRef(0)
    const c_y = useRef(0)

    const pushSuccess = async () => {
        const client = createSupabaseClient();
        await client
            .from("Guesses")
            .insert({
                created_by : "abird",
                guesses_remaining : guesses_remaind,
                post_id : allPosts![postIndex]['id'],
                success : true
              })

    }

    const detColor = useCallback(() => {
        dec();
        console.log("detcolor : ", c_x.current, c_y.current, post_x, post_y)
        let hav_dist = null;
        if (c_x.current && c_y.current){
            hav_dist = calculateDistanceInMiles(c_y.current, c_x.current, post_y,post_x)
            console.log("hav dist : ", hav_dist)
        }

        if (current_guess_dist  && hav_dist ){
            const diff_dist = hav_dist;
            let res = logToRange(diff_dist)
            if (res > 45){
                pushSuccess();
                toast.success("You have successfully guessed the location !")
                //set_dist_val(100)
                set_current_color("range range-success")
                setMessage('You got it!');
            }else if (30 <  res){

                set_current_color("range range-info")
                setMessage("You are so close!")
            }else if (15 <  res){
                
                set_current_color( "range range-warning")
                setMessage("You're getting somewhere...")
            }else {
                
                set_current_color( "range range-error")
                setMessage("Not quite")
            }
            console.log("diff dist : ", diff_dist)
            
            console.log("log res : ", res)
            set_dist_val(res)
            
        }else {
            set_dist_val(0);
            set_current_color("range range-error");
        }
    },[current_guess_dist, post_x, post_y, dist_val, guesses_remaind])
    const update_x = useCallback((x : number, y : number) => {
        c_x.current = x
        c_y.current = y
        if(post_x && post_y) {
            detColor()
        }
    }, [detColor, post_x, post_y])

    // const color_lerp_map = [
    //     "error",
    //     "error",
    //     "warning",
    //     "info",
    //     "success"

    // ]
    function logToRange(distance: number, maxDistance: number = 12500, base: number = 10): number {
        // Ensure distance does not exceed max_distance
        if (distance > maxDistance) {
            distance = maxDistance;
        }
     
        // Apply logarithmic scaling
        const scaledDistance = Math.log(distance + 1) / Math.log(base);  // +1 to avoid log(0)
        const maxScaledDistance = Math.log(maxDistance + 1) / Math.log(base);
     
        // Normalize the scaled distance to a value between 0 and 1
        const normalized = scaledDistance / maxScaledDistance;
     
        // Map to slider range (0 to 100)
        const sliderValue = (1 - normalized) * 100;
        return sliderValue;
    }
       

    function calculateDistanceInMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 3958.8; // Radius of the Earth in miles
        const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
    
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
            
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        return R * c; // Distance in miles
    }

    
    

    async function getPublicPicUrl(filename: string) {
        // const k = await supabase.from('Users').insert({ username: "testname", name: "John DOe" })

        const {data} = createSupabaseClient().storage.from('user-images').getPublicUrl(filename);
        console.log("in the function : ",data["publicUrl"]);
        return data["publicUrl"]
    }
    useEffect(() => {
        console.log(c_y.current, c_x.current)
   
    }, [c_y.current, c_x.current, dist_val, post_x, post_y])

    useEffect(() => {
        const retrieve = async () => {
            const url = await getPublicPicUrl(allPosts![postIndex]['pic_uri']);
            setImage(url);
        }
        if(allPosts) {
            retrieve();
            setguessdist(allPosts[postIndex]['distance']);
            set_x(allPosts[postIndex]['longitude']);
            console.log(post_x)
            set_y(allPosts[postIndex]['latitude']);
            console.log(post_y)
            guesses_remaind.current = (allPosts![postIndex]['guesses_max'])
        }
    }, [allPosts, postIndex, guesses_remaind])

    useEffect(() => {
        const retrieve = async () => {
            const all_posts = await getAllPosts();
            //console.log("all posts 2: ", all_posts)
            setAllPosts(all_posts);
        }
        retrieve();
       //console.log("get uri function : ", getPublicPicUrl(allPosts[postIndex]['pic_uri']));


      }, []);

    return (
        <>
        <div className="card bg-base-100 w-full">
            <div className="grid grid-cols-4">
                <div className="col-span-1 place-items-center card bg-base-100">
                    {allPosts &&                     
                        <>
                        {image && 
                            <figure className="h-96">
                                <img src={image} alt="Italy"/>
                            </figure>
                        }

                        <h1 className="text-3xl">
                            @{allPosts[postIndex]['created_by']}
                        </h1>
                        <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-title">Guesses Remaining</div>
                            <div className="stat-value place-self-center">{guesses_remaind.current}</div>
                        </div>
                        </div>
                        <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-title">Success Distance</div>
                            <div className="stat-value place-self-center">{allPosts[postIndex]['distance']} miles</div>
                        </div>
                        </div>
                        </>
                    }
                    {/* <input type="range" min={0} max="100" value={dist_val} className={`range range-${current_color}`} /> */}
                    
                    <div className="join mt-3">
                        <button  onClick={() => setPostIndex(postIndex-1)} disabled={postIndex ==0} className="join-item btn btn-outline">Prev</button>
                        <button  onClick={() => {setPostIndex(postIndex+1)}} disabled={postIndex == allPosts?.length! - 1}className="join-item btn btn-outline">Next</button>
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="card bg-base-100">
                    {allPosts &&
                        <EsriMap user_x = {update_x} start_x={-118.80500} start_y={34.02700} post_x_coord= {allPosts[postIndex]['longitude']} 
                        post_y_coord={allPosts[postIndex]['latitude']} point_ref={null} total_guesses={guesses_remaind.current? guesses_remaind.current : 3 }/>
                    }

                    <div className='mt-6 mx-6'>
                    {current_guess_dist && <input value={dist_val} id="slider" type="range" min={0} max="70" className={current_color.current} step="1" />}
                    <h1 className='justify-self-center text-center text-2xl'>{message}</h1>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
