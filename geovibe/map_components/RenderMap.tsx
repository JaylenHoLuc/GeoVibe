'use client';
import ArcGISMap from '@arcgis/core/Map'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import MapView from '@arcgis/core/views/MapView'
import Extent from '@arcgis/core/geometry/Extent'
import { watch } from '@arcgis/core/core/reactiveUtils'
import Map from '@arcgis/core/Map';
import Expand from '@arcgis/core/widgets/Expand'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Popup from "@arcgis/core/widgets/Popup.js";

const RenderMap = ({start_x, start_y, point_ref, total_guesses, post_x_coord, post_y_coord, user_x, user_y} :
    {start_x : number, start_y : number, point_ref: null | Graphic, total_guesses : number | null, post_x_coord : number | null, post_y_coord : number | null, user_x : Function | null, user_y : Function | null}) => {
    console.log("post lat : ",post_y_coord)
    console.log("post long : ",post_x_coord)
    const [currentPointer, setPointer] = useState<Graphic | null>(null);
    let guesses_remain = total_guesses;
    let graphicsLayer : GraphicsLayer | null = null;
    const graphicsLayerRef = useRef<GraphicsLayer | null>(null);
    let clickHandler: IHandle | null = null;

    const guessAttempt = () => {

    }


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
                container: styles.mapContainer,
                map: map,
                center: [start_x, start_y],
                zoom: 3,
                constraints: {
                minZoom: 3
                }
                
            });
            view.popupEnabled = false;

            graphicsLayer = new GraphicsLayer();
            graphicsLayerRef.current = graphicsLayer;
            map.add(graphicsLayer);
            console.log("tot guess : ",total_guesses);
            if (total_guesses != null && guesses_remain && guesses_remain > 0){
                console.log("curr guesses : ",guesses_remain)
                if (point_ref != null){
                    console.log("preset point : ",point_ref)
                    graphicsLayerRef.current!.add(point_ref);
                    setPointer(point_ref);
                    
                }

                clickHandler = view.on("click", function(event) {
                    // Get the coordinates of the clicked point
                    const mapPoint = event.mapPoint;
                    const x = mapPoint.longitude;
                    const y = mapPoint.latitude;
                    addPoint(view, x, y);
                    guesses_remain = guesses_remain! - 1
                    view!.openPopup({
                        // Set the popup's title to the coordinates of the clicked location
                        title: "Reverse geocode",
                        location: event.mapPoint // Set the location of the popup to the clicked location
                      });
                    if (user_x && user_y){
                        user_x(x);
                        user_y(y);

                    }

                    if (guesses_remain == 0){
                        console.log("u lose");
                        clickHandler?.remove();
                        clickHandler = null;
                        guesses_remain = null;
                    }
                    console.log("Clicked coordinates:", x, y);
                    });
                }
  
               
            }   
        initMap();     
      return () => {
        if (view) {
            view.destroy();
            view = null;
        }
      };
      
    }, [mapRef]);
  
    return (

            <div>
                <div ref={mapRef} id={styles.mapContainer} style={{ width: '100%', height: '400px' }}></div>
            </div>

    );
}



export default RenderMap;