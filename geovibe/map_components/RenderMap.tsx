'use client';
import config from '@arcgis/core/config'
import ArcGISMap from '@arcgis/core/Map'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import MapView from '@arcgis/core/views/MapView'
import Extent from '@arcgis/core/geometry/Extent'
import { watch } from '@arcgis/core/core/reactiveUtils'
import Map from '@arcgis/core/Map';
import Expand from '@arcgis/core/widgets/Expand'
import { useEffect, useRef } from 'react'
const RenderMap = () => {

    const mapRef = useRef(null);

    useEffect(() => {
      let view: { destroy: () => void; } | null;
      (async () => {

        const map = new Map({
          basemap: 'topo-vector'
        });
  
        view = new MapView({
          container: mapRef.current!,
          map: map,
          center: [-118.80500, 34.02700],
          zoom: 3
        });
      })();
  
      return () => {
        if (view) {
          view.destroy();
          view = null;
        }
      };
    }, []);
  
    return <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>;
}



export default RenderMap;