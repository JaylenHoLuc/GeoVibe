'use client'
import Link from "next/link";
<<<<<<< HEAD


const Navbar = () => {
=======
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";


const Navbar = () => {
    const [currentPage, setCurrentPage] = useState("");
    const pathname = usePathname();


    useEffect(() => {
        console.log(pathname)
        // Set currentPage based on pathname to highlight correct page
        if (pathname === '/guess') {
          setCurrentPage('guess');
        }
        else if (pathname.endsWith('/feed')) {
          setCurrentPage('feed');
        }
        else if (pathname.endsWith('/profile')) {
          setCurrentPage('profile');
        } 
        else if (pathname.endsWith('/post')) {
          setCurrentPage('post');
        }
        else {
          setCurrentPage('');
        }
      }, [pathname]);
>>>>>>> eac58be11de09cbb8d735cc04e0478d9bc790ad0
    return (
        <>
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <a className="btn btn-ghost text-xl">GeoVibe</a>
                <ul className="menu menu-horizontal px-1">
<<<<<<< HEAD
                <li><Link href="/guess">Guess</Link></li>
                <li><Link href="/post">Post</Link></li>
                <li><Link href="/guessed">Already Guessed</Link></li>
                <li><Link href="/profile">Profile</Link></li>
=======
                    <li><Link className={currentPage === 'guess' ? 'active' : ''} href="/guess">Guess</Link></li>
                    <li><Link className={currentPage === 'post' ? 'active' : ''} href="/post">Post</Link></li>
                    <li><Link className={currentPage === 'feed' ? 'active' : ''} href="/feed">Feed</Link></li>
                    <li><Link className={currentPage === 'profile' ? 'active' : ''} href="/profile">Profile</Link></li>
>>>>>>> eac58be11de09cbb8d735cc04e0478d9bc790ad0
                </ul>
            </div>
            <div className="navbar-start">
            </div>
        </div>
        </>
    );
}



export default Navbar;