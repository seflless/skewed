import React from "react";
import { point3DToIsometric } from "./Camera";

export type GridProps = {
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
};

/*

       Coordinate System                              
               Y                     
               |                                         
               |                     
               |                     
               |                     
             /   \                   
           /       \                
         Z           \ X
         
        Vertices Indices

                0                    
               /-                    
             /-  \-                  
          /--      \-                
       /--           \-              
  3  /-                \-  1         
   --                   --|          
    -\               --/            
      --\          -/               
         --\ 2  --/                 
            ---/                    

 */

export const GridColor = "#E1E1E1";

export function Grid(props: GridProps) {
  const gridPoints = [
    [-props.width / 2, 0, -props.depth / 2],
    [+props.width / 2, 0, -props.depth / 2],
    [+props.width / 2, 0, +props.depth / 2],
    [-props.width / 2, 0, +props.depth / 2],
  ];

  let points = "";
  // A face
  gridPoints.forEach((vertex) => {
    const { x, y } = point3DToIsometric(
      vertex[0] + props.x,
      vertex[1] + props.y,
      vertex[2] + props.z
    );
    console.log(`(${vertex[0]},${vertex[1]},${vertex[2]}) -> (${x},${y})`);
    points += `${Math.floor(x)},${Math.floor(y)} `;
  });

  const floorPolygon = (
    <polygon points={points} fill="url(#isometric-grid)" stroke={GridColor} />
  );

  return (
    <svg
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ position: "absolute" }}
    >
      <defs>
        <pattern
          id="isometric-grid"
          patternUnits="userSpaceOnUse"
          width="173"
          height="99"
          viewBox="0 0 173 99"
        >
          <g strokeWidth="1.2" stroke={GridColor} fill="none">
            <polygon points="87,0 173,50 87,99 0,50" />
          </g>
        </pattern>
      </defs>
      {floorPolygon}
    </svg>
  );
}
