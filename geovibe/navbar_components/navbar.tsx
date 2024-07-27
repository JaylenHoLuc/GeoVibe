'use client'
import Link from "next/link";


const Navbar = () => {
    return (
        <>
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <a className="btn btn-ghost text-xl">GeoVibe</a>
                <ul className="menu menu-horizontal px-1">
                <li><Link href="/guess">Guess</Link></li>
                <li><Link href="/post">Post</Link></li>
                <li><Link href="/guessed">Already Guessed</Link></li>
                <li><Link href="/profile">Profile</Link></li>
                </ul>
            </div>
            <div className="navbar-start">
            </div>
        </div>
        </>
    );
}



export default Navbar;