'use client';
import ArcGISMap from '@arcgis/core/Map'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import MapView from '@arcgis/core/views/MapView'
import Extent from '@arcgis/core/geometry/Extent'
import { watch } from '@arcgis/core/core/reactiveUtils'
import Map from '@arcgis/core/Map';
import Expand from '@arcgis/core/widgets/Expand'
import { useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";


const RenderMap = ({start_x, start_y} :{start_x : number, start_y : number}) => {
    
    const [currentPointer, setPointer] = useState<Graphic | null>(null);
    let graphicsLayer : GraphicsLayer | null = null;
    const graphicsLayerRef = useRef<GraphicsLayer | null>(null);
    
    const addPoint = (view :  MapView | null , x : number, y : number) => {
       
            const point = new Point({
                longitude: x,
                latitude: y
            });
            
            const markerSymbol = {
                type: "simple-marker", // Use a simple marker symbol
                color: [226, 119, 40], // Set marker color
                outline: {
                color: [255, 255, 255], // Set outline color
                width: 2
                }
            };
            
            const pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol
            });
            if (currentPointer && graphicsLayerRef.current){
                // const graphicToRemove = graphicsLayer.graphics.find(
                //     (graphic) => graphic.attributes.id === "point-id"
                //   );
                const graphics = graphicsLayerRef.current.graphics;
                if (graphics.length > 0) {
                    graphicsLayerRef.current.remove(graphics.getItemAt(graphics.length - 1));
                }
            }

            // if (currentPointer && graphicsLayerRef.current) {
            //     graphicsLayerRef.current.remove(currentPointer);
            //   }

            graphicsLayerRef.current!.add(pointGraphic);
            setPointer(pointGraphic);

            //movePoint(view, x , y);
            // view!.graphics.add(currentPointer);
          
        
       
    }

    const mapRef = useRef(null);

    useEffect(() => {
        let view : MapView | null;
        

        const initMap = async () => {
            const map = new Map({
                basemap: 'topo-vector'
            });

            view = new MapView({
                container: mapRef.current!,
                map: map,
                center: [start_x, start_y],
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

            graphicsLayer = new GraphicsLayer();
            graphicsLayerRef.current = graphicsLayer;
            map.add(graphicsLayer);



            view.ui.add(expand, "top-right")
            view.on("click", function(event) {
                // Get the coordinates of the clicked point
                const mapPoint = event.mapPoint;
                const x = mapPoint.longitude;
                const y = mapPoint.latitude;
                console.log("currentpointer: ", currentPointer)
                addPoint(view, x, y);
                console.log("Clicked coordinates:", x, y);
                });
            }   
        initMap();     
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