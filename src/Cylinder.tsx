import React from "react";
import { point3DToIsometric } from "./Camera";

type CylinderProps = {
  x: number;
  y: number;
  z: number;
  height: number;
  radius: number;
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
  height,
  radius,
}: CylinderProps): Array<Array<Array<Array<number>>>> {
  const vertices = [
    [height, radius, 0],
    // 0,1,2,3
    // [-width / 2, +height / 2, -depth / 2],
    // [+width / 2, +height / 2, -depth / 2],
    // [+width / 2, +height / 2, +depth / 2],
    // [-width / 2, +height / 2, +depth / 2],
    // // 4,5,6
    // [+width / 2, -height / 2, -depth / 2],
    // [+width / 2, -height / 2, depth / 2],
    // [-width / 2, -height / 2, depth / 2],
  ];
  return [
    // Faces
    [
      // Top Face
      [vertices[0], vertices[0], vertices[0], vertices[0]],
    ],
    // Outline
    [[]],
  ];
}

export function Cylinder(props: CylinderProps) {
  const polygons = generatePolygons(props);
  const faces = polygons[0];
  const colors = ["rgb(240,240,240)", "rgb(150,150,150)", "rgb(100,100,100)"];

  return (
    <svg width={2000} height={2000}>
      <g transform="translate(500,500)">
        {
          // All faces
          faces.map((face, i) => {
            let points = "";
            // A face
            face.forEach((vertex, j) => {
              const { x, y } = point3DToIsometric(
                vertex[0],
                vertex[1],
                vertex[2]
              );
              console.log(
                `(${vertex[0]},${vertex[1]},${vertex[2]}) -> (${x},${y})`
              );
              points += `${Math.floor(x)},${Math.floor(y)} `;
            });
            //   "0,100 50,25 50,75 100,0";
            return <polygon fill={colors[i]} key={i} points={points} />;
          })
        }
      </g>
    </svg>
  );
}
