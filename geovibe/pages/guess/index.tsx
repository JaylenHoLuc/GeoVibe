import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import RenderMap from "@/map_components/RenderMap";
import dynamic from "next/dynamic";
import Navbar from "@/navbar_components/navbar";
import italy_photo from '@/fixtures/italy_photo.jpeg'
import {getAllPosts} from "@/lib/SupabaseHelper";
import { useState } from "react";
import createSupabaseClient from "@/lib/supabaseclient";
import { useEffect } from 'react';

const inter = Inter({ subsets: ["latin"] });

export default function Guess() {

    const [allPosts,setAllPosts] = useState<any[] | null>(null);
    const [postIndex,setPostIndex] = useState(0);
    const [image,setImage] = useState('');
    const [dist_val, set_dist_val] = useState(0);
    const [current_guess_dist, setguessdist] = useState(0);
    const [post_x , set_x] = useState(0);
    const [post_y, set_y] = useState(0);
    let c_x = 0;
    function set_cx (x : number) {
        c_x = x
    }
    let c_y = 0;
    function set_cy (y : number) {
        c_y = y
    }
    const [current_color, set_current_color ] = useState("error");
    const color_lerp_map = [
        "error",
        "error",
        "warning",
        "info",
        "success"

    ]

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

    const detColor = (dist_val : number) => {
        let hav_dist = null;
        if (c_x && c_y){
            //calculateDistance(post_x,post_y, )
        }

        if (current_guess_dist && dist_val && hav_dist ){

        }else{
            return "error";
        }
    }
    const EsriMap = dynamic(() => import("@/map_components/RenderMap"), { ssr: false });

    async function getPublicPicUrl(filename: string) {
        // const k = await supabase.from('Users').insert({ username: "testname", name: "John DOe" })

        const {data} = createSupabaseClient().storage.from('user-images').getPublicUrl(filename);
        console.log("in the function : ",data["publicUrl"]);
        return data["publicUrl"]
    }
    // useEffect(() => {
        
    // }, [c_y, c_x])

    useEffect(() => {
        const retrieve = async () => {
            const url = await getPublicPicUrl(allPosts![postIndex]['pic_uri']);
            setImage(url);
        }
        if(allPosts) {
            retrieve();
            setguessdist(allPosts[postIndex]['distance']);
            set_x(allPosts[postIndex]['longitude']);
            set_y(allPosts[postIndex]['latitude']);
        }
    }, [allPosts, postIndex])

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
                            <div className="stat-value place-self-center">{allPosts[postIndex]['guesses_max']? allPosts[postIndex]['guesses_max'] : 3 }</div>
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
                    {current_guess_dist && <input type="range" min={0} max="100" value={dist_val} className={`range range-${detColor(current_guess_dist)}`} step="25" />}
                    <div className="flex w-full justify-between px-2 text-xs">
                        <span>|</span>
                        <span>|</span>
                        <span>|</span>
                        <span>|</span>
                        <span>|</span>
                    </div>
                    {/* <input type="range" min={0} max="100" value={dist_val} className={`range range-${current_color}`} /> */}
                    
                    <div className="join mt-3">
                        <button  onClick={() => setPostIndex(postIndex-1)} disabled={postIndex ==0} className="join-item btn btn-outline">Prev</button>
                        <button  onClick={() => {setPostIndex(postIndex+1)}} disabled={postIndex == allPosts?.length! - 1}className="join-item btn btn-outline">Next</button>
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="card bg-base-100">
                    {allPosts &&
                        <EsriMap user_x = {set_cx} user_y = {set_cy}start_x={-118.80500} start_y={34.02700} post_x_coord= {allPosts[postIndex]['longitude']} 
                        post_y_coord={allPosts[postIndex]['latitude']} point_ref={null} total_guesses={allPosts![postIndex]['guesses_max']? allPosts![postIndex]['guesses_max'] : 3 }/>
                    }
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
