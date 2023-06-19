import { Vector3 } from "../Vector3";
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

const size = 100;
export const BoxMesh = extrude(
  [
    Vector3(-size / 2, 0, -size / 2),
    Vector3(size / 2, 0, -size / 2),
    Vector3(size / 2, 0, size / 2),
    Vector3(-size / 2, 0, size / 2),
  ],
  size
);
