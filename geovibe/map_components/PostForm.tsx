'use client';
import ArcGISMap from '@arcgis/core/Map'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import MapView from '@arcgis/core/views/MapView'
import Extent from '@arcgis/core/geometry/Extent'
import { watch } from '@arcgis/core/core/reactiveUtils'
import Map from '@arcgis/core/Map';
import Expand from '@arcgis/core/widgets/Expand'
import { useEffect, useRef } from 'react'
import styles from './styles.module.css'
const PostForm = () => {
    const handleSubmit = () => {

    }
    const mapRef = useRef(null);

    useEffect(() => {
 
   
    },[]);
  
    return (
        <div id="post-wrap" onSubmit={handleSubmit}>
            <form id={styles.postBox}>
                <p color='black'>Create a Post</p>
                <label>Latitude</label>
                <input type="text" name= "Latitude" />
                <label>Longitude</label>
                <input type="text" name= "Longitude" />
                <button> Post </button>
                <br></br>
                
                <output id = "output-wrapper"></output>
                
            </form>

        </div>

    );
}



export default PostForm;