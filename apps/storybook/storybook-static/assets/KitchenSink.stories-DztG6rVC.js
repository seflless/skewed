import{j as t}from"./jsx-runtime-Cf8x2fCZ.js";import{d,S as h,A as a,C as o,D as c,V as i,B as k,c as p,a as m,M as x,T as g,H as S}from"./StorySkewed-hHOe6bVO.js";import"./index-yBjzXJbu.js";import"./index--qcDGAq6.js";import"./index-BJugVxuy.js";import"./client-B72CF2d-.js";const V={title:"Scenes/KitchenSink"},e={render:()=>{const l=d(120,80,60);return t.jsxs(h,{width:900,height:500,children:[t.jsx(a,{color:o(64,64,64)}),t.jsx(c,{direction:i(-.25,-1,-.25).normalize(),color:o(255,252,255)}),t.jsx(k,{width:160,height:120,depth:80,fill:o(255,180,0),stroke:o(0,0,0),strokeWidth:2,position:i(-260,60,0)}),t.jsx(p,{radius:90,fill:o(120,190,255),stroke:o(0,0,0),strokeWidth:2,position:i(0,100,0)}),t.jsx(m,{radius:70,height:180,fill:o(180,120,180),stroke:o(0,0,0),strokeWidth:2,position:i(260,90,0),rotation:i(90,30,0)}),t.jsx(x,{mesh:l,fill:o(180,255,180),stroke:o(0,0,0),strokeWidth:2,position:i(0,40,-180)}),t.jsx(g,{text:"Skewed",position:i(-120,250,0),fontSize:160,fill:o(255,0,0),stroke:o(0,0,0),strokeWidth:6,rotation:i(0,135,0)}),t.jsx(S,{id:"kitchen-sink-story",position:i(300,40,0),width:260,height:110,children:t.jsxs("div",{style:{background:"rgba(255,255,255,0.9)",border:"2px solid black",padding:12},children:[t.jsx("strong",{children:"KitchenSink"}),t.jsx("div",{style:{fontSize:12},children:"All primitives together"})]})})]})}};var r,s,n;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const mesh = BoxMesh(120, 80, 60);
    return <StorySkewed width={900} height={500}>
        <AmbientLight color={Color(64, 64, 64)} />
        <DirectionalLight direction={Vector3(-0.25, -1, -0.25).normalize()} color={Color(255, 252, 255)} />

        <Box width={160} height={120} depth={80} fill={Color(255, 180, 0)} stroke={Color(0, 0, 0)} strokeWidth={2} position={Vector3(-260, 60, 0)} />
        <Sphere radius={90} fill={Color(120, 190, 255)} stroke={Color(0, 0, 0)} strokeWidth={2} position={Vector3(0, 100, 0)} />
        <Cylinder radius={70} height={180} fill={Color(180, 120, 180)} stroke={Color(0, 0, 0)} strokeWidth={2} position={Vector3(260, 90, 0)} rotation={Vector3(90, 30, 0)} />
        <Mesh mesh={mesh} fill={Color(180, 255, 180)} stroke={Color(0, 0, 0)} strokeWidth={2} position={Vector3(0, 40, -180)} />
        <Text text="Skewed" position={Vector3(-120, 250, 0)} fontSize={160} fill={Color(255, 0, 0)} stroke={Color(0, 0, 0)} strokeWidth={6} rotation={Vector3(0, 135, 0)} />

        <Html id="kitchen-sink-story" position={Vector3(300, 40, 0)} width={260} height={110}>
          <div style={{
          background: "rgba(255,255,255,0.9)",
          border: "2px solid black",
          padding: 12
        }}>
            <strong>KitchenSink</strong>
            <div style={{
            fontSize: 12
          }}>All primitives together</div>
          </div>
        </Html>
      </StorySkewed>;
  }
}`,...(n=(s=e.parameters)==null?void 0:s.docs)==null?void 0:n.source}}};const b=["Static"];export{e as Static,b as __namedExportsOrder,V as default};
