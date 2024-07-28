import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import RenderMapFeed from "@/map_components/RenderMapFeed";
import dynamic from "next/dynamic";
import Navbar from "@/navbar_components/navbar";
import { useEffect, useState } from "react";
import { getAllPosts, getAllPostsUnlimited } from "@/lib/SupabaseHelper";

const inter = Inter({ subsets: ["latin"] });

export default function Feed() {
    const [selectedP, setPosts] = useState<any[] | null>(null);
    const [xs, setXs] = useState([])
    const [ys, setYs] = useState([]);
    const [all_posts, setAllPosts] = useState([])


    const EsriMap = dynamic(() => import("@/map_components/RenderMapFeed"), { ssr: false });

    useEffect(() => {
        const fetchPosts = async () => {
        const allPosts = await getAllPostsUnlimited();
        const ys = allPosts?.map(post => post.latitude);
        const xs = allPosts?.map(post => post.longitude);
        setXs(xs);
        setYs(ys);
        setAllPosts(allPosts);
        // console.log(xs)
        }
        fetchPosts()
    },[]);
        
    return (
        <>
        <div>
            {/* <div className="col-span-1 place-items-center card bg-base-100">
                <div className="post-feed">
                    {xs && <></>}
                    {!xs && <div className="post">
                    <h2 className="post-title">Select a pin to see the post!</h2>
                    </div>}
                </div>
            </div> */}
            <div className="col-span-4">
                <div className="card bg-base-100">
                <EsriMap start_x={-118.80500} start_y={34.02700} point_ref={null} x_coords ={xs} y_coords={ys} allPosts={all_posts}/>
                </div>
            </div>
        </div>
        <div>
            <h2>Select a pin to see the post!</h2>
        </div>
        </>
    );
}
