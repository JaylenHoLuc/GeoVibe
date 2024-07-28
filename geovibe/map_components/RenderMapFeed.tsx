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
import PopupTemplate from '@arcgis/core/PopupTemplate';
import { getRealNameFromUserName, getPublicPicUrl } from "@/lib/SupabaseHelper";


const RenderMapFeed = ({start_x, start_y, x_coords, y_coords, allPosts} :
    {start_x : number, start_y : number, x_coords: [number] | null, y_coords: [number] | null, allPosts: [] | null}) => {
    const [currentPointer, setPointer] = useState<Graphic | null>(null);
    let graphicsLayer : GraphicsLayer | null = null;
    const graphicsLayerRef = useRef<GraphicsLayer | null>(null);
    let clickHandler: IHandle | null = null;
    // const addPoint = (view :  MapView | null , x : number, y : number) => {
      const addPoint = async (view :  MapView | null , post: any | null) => {

        const realName = await getRealNameFromUserName(post.created_by);
        const publicPicUrl = await getPublicPicUrl(post.pic_uri);


            // const point = new Point({
            //     longitude: x,
            //     latitude: y,
            // });

            const point = new Point({
              longitude: post.longitude,
              latitude: post.latitude,
          });
            
            const markerSymbol = {
                type: "simple-marker", // Use a simple marker symbol
                color: [226, 119, 40], // Set marker color
                outline: {
                color: [255, 255, 255], // Set outline color
                width: 2
                }
            };
            
            const template = {
                title: post.created_by,
                caption: "CAPTION",
                // content: "<p>" + post.description + "</p><img src='https://rajxtaeiecyqefngyhgw.supabase.co/storage/v1/object/public/user-images/abird/Australia.JPG'/>"
                content: [{
                  type: "media",
                  title: realName,
                  activeMediaInfoIndex: 0,
                  mediaInfos: [
                    {
                      // title: "<b>PIC TITLE<b>",
                      type: "image",
                      caption: post.description,
                      value: {
                        sourceURL: publicPicUrl
                      }
                    }
                  ]
                }]
            }
            
            const pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
                popupTemplate: template
            });
            graphicsLayerRef.current!.add(pointGraphic);
            graphicsLayer?.add(pointGraphic)
            console.log("here: ", post.longitude, post.latitude)

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

            graphicsLayer = new GraphicsLayer();
            graphicsLayerRef.current = graphicsLayer;
            map.add(graphicsLayer);

            // x_coords?.forEach((x, index) => {
            //     x && y_coords[index] && addPoint(view, x, y_coords[index])
            // })
            allPosts.forEach((post, index) => {
              post.latitude && post.longitude && addPoint(view, post)
            })
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

        <div ref={mapRef} id={styles.mapContainer} style={{ width: '100%', height: '600px' }}></div>


    );
}



export default RenderMapFeed;