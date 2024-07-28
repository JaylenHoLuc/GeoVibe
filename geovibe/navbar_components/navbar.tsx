'use client'
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import image from '@/fixtures/2.png'

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
    return (
        <>
        <div className="navbar bg-base-100">
            <div className="navbar-start">
              <img src={image.src} className='h-10 mr-6'/>
                <ul className="menu menu-horizontal px-1">
                    <li><Link className={currentPage === 'guess' ? 'active' : ''} href="/guess">Guess</Link></li>
                    <li><Link className={currentPage === 'post' ? 'active' : ''} href="/post">Post</Link></li>
                    <li><Link className={currentPage === 'feed' ? 'active' : ''} href="/feed">Feed</Link></li>
                    <li><Link className={currentPage === 'profile' ? 'active' : ''} href="/profile">Profile</Link></li>
                </ul>
            </div>
            <div className="navbar-start">
            </div>
        </div>
        </>
    );
}



export default Navbar;