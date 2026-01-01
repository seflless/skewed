import { Vector3 } from "../math/Vector3";
import { extrude } from "./Extrude";

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
   |        /|7           |          
   |    /    |   \        |          
  6 -/       |      \     |           
    \-       |        - /  4         
      \-     |        /-             
        \-   |     /-                
          \- | /--                   
             --                      
             5                       


 */

export function BoxMesh(width: number, height: number, depth: number) {
  return extrude(
    [
      Vector3(-width / 2, 0, -depth / 2),
      Vector3(width / 2, 0, -depth / 2),
      Vector3(width / 2, 0, depth / 2),
      Vector3(-width / 2, 0, depth / 2),
    ],
    height
  );
}
