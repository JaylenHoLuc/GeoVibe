import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import RenderMap from "@/map_components/RenderMap";
import dynamic from "next/dynamic";
import Navbar from "@/navbar_components/navbar";
import italy_photo from '@/fixtures/italy_photo.jpeg'
import getAllPosts from "@/lib/SupabaseHelper";
import { useState } from "react";
import createSupabaseClient from "@/lib/supabaseclient";
import { useEffect } from 'react';

const inter = Inter({ subsets: ["latin"] });

export default function Guess() {

    const [allPosts,setAllPosts] = useState<any[] | null>(null);
    const [postIndex,setPostIndex] = useState(0);
    const [image,setImage] = useState('');


    const EsriMap = dynamic(() => import("@/map_components/RenderMap"), { ssr: false });

    async function getPublicPicUrl(filename: string) {
        // const k = await supabase.from('Users').insert({ username: "testname", name: "John DOe" })

        const {data} = createSupabaseClient().storage.from('user-images').getPublicUrl(filename);
        console.log("in the function : ",data["publicUrl"]);
        return data["publicUrl"]
    }

    useEffect(() => {
        const retrieve = async () => {
            const url = await getPublicPicUrl(allPosts![postIndex]['pic_uri']);
            setImage(url);
        }
        if(allPosts) {
            retrieve();
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
                        </>
                    }

                    
                    <div className="join mt-3">
                        <button  onClick={() => setPostIndex(postIndex-1)} disabled={postIndex ==0} className="join-item btn btn-outline">Prev</button>
                        <button  onClick={() => {setPostIndex(postIndex+1)}} disabled={postIndex == allPosts?.length! - 1}className="join-item btn btn-outline">Next</button>
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="card bg-base-100">
                    {allPosts &&
                        <EsriMap start_x={-118.80500} start_y={34.02700} post_x_coord= {allPosts[postIndex]['longitude']} post_y_coord={allPosts[postIndex]['latitude']} point_ref={null} total_guesses={allPosts![postIndex]['guesses_max']? allPosts![postIndex]['guesses_max'] : 3 }/>
                    }
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
