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
const RenderMap = () => {

    const mapRef = useRef(null);

    useEffect(() => {
      let view : MapView | null;
      (async () => {

        const map = new Map({
          basemap: 'topo-vector'
        });
  
        view = new MapView({
          container: mapRef.current!,
          map: map,
          center: [-118.80500, 34.02700],
          zoom: 3,
          constraints: {
            minZoom: 3
          }
          
        });
        const postWidget =  document.getElementById("post-wrap")!;
        const expand = new Expand({
            content: postWidget,
            expanded: false
        })
        view.ui.add(expand, "top-right")
    
      })();
  
      return () => {
        if (view) {
          view.destroy();
          view = null;
        }
      };
    }, []);
  
    return (

        <div ref={mapRef} id={styles.mapContainer} style={{ width: '100%', height: '400px' }}></div>


    );
}



export default RenderMap;