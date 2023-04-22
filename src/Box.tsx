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
  return [
    // Faces
    [
      // Top Face
      [
        [-width / 2, +height / 2, -depth / 2],
        [+width / 2, +height / 2, -depth / 2],
        [+width / 2, +height / 2, +depth / 2],
        [-width / 2, +height / 2, +depth / 2],
      ],
      // Front Face
      //   [
      //     [-width / 2, +height / 2, +depth / 2],
      //     [+width / 2, +height / 2, +depth / 2],
      //     [+width / 2, -height / 2, +depth / 2],
      //     [-width / 2, -height / 2, +depth / 2],
      //   ],
      // Right Face
      [
        [-width / 2, -height / 2 + 500, -depth / 2],
        [+width / 2, -height / 2 + 500, -depth / 2],
        [+width / 2, -height / 2 + 500, +depth / 2],
        [-width / 2, -height / 2 + 500, +depth / 2],
      ],
    ],
    // Outline
    [[]],
  ];
}

export function Box(props: BoxProps) {
  const polygons = generatePolygons(props);
  const faces = polygons[0];

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
              points += `${Math.floor(x)},${Math.floor(y)} `;
            });
            //   "0,100 50,25 50,75 100,0";
            return <polygon key={i} points={points} />;
          })
        }
      </g>
    </svg>
  );
}
