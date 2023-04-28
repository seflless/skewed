import React from "react";
import { point3DToIsometric } from "./Camera";

type BoxProps = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  fill: string;
  stroke: string;
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
   |-\               --/  |          
   |  --\          -/     |          
   |     --\ 2  --/       |          
   |        ---/          |          
   |         |            |          
   |         |            |          
   |         |            |          
   |         |            |          
  6 -        |            |           
    \-       |           /  4         
      \-     |        /-             
        \-   |     /-                
          \- | /--                   
             --                      
             5                       


 */

function generatePolygons({
  width,
  height,
  depth,
}: BoxProps): Array<Array<Array<Array<number>>>> {
  const vertices = [
    // 0,1,2,3
    [-width / 2, +height / 2, -depth / 2],
    [+width / 2, +height / 2, -depth / 2],
    [+width / 2, +height / 2, +depth / 2],
    [-width / 2, +height / 2, +depth / 2],
    // 4,5,6
    [+width / 2, -height / 2, -depth / 2],
    [+width / 2, -height / 2, depth / 2],
    [-width / 2, -height / 2, depth / 2],
  ];
  return [
    // Faces
    [
      // Right Face (2,1,4,5)
      [vertices[3], vertices[2], vertices[5], vertices[6]],
      // Front Face
      [vertices[2], vertices[1], vertices[4], vertices[5]],

      // Top Face
      [vertices[0], vertices[1], vertices[2], vertices[3]],
    ],
    // Outline
    [[]],
  ];
}

export function Box(props: BoxProps) {
  const polygons = generatePolygons(props);
  const faces = polygons[0];
  const brightness = [160 / 255, 210 / 255, 255 / 255];

  return (
    <g>
      {
        // All faces
        faces.map((face, i) => {
          let points = "";
          // A face
          face.forEach((vertex) => {
            const { x, y } = point3DToIsometric(
              vertex[0] + props.x,
              vertex[1] + props.y,
              vertex[2] + props.z
            );
            points += `${Math.floor(x)},${Math.floor(y)} `;
          });
          //   "0,100 50,25 50,75 100,0";
          return (
            <polygon
              fill={props.fill}
              style={{
                filter: `brightness(${brightness[i]}) ${
                  i !== 2 ? "drop-shadow(0px 0px 5px rgb(0,0,0,0.5))" : ""
                }`,
              }}
              key={i}
              points={points}
            />
          );
        })
      }
    </g>
  );
}
