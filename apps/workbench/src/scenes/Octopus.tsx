import * as React from "react";
import { Cylinder, Group, Sphere } from "skewed";
import { Color, Vector3 } from "skewed";

const BodyColor = Color(180, 120, 180);

function pingPongTime(scaleFactor: number, now: number): number {
  const timeInSeconds = now * scaleFactor;
  return Math.sin((timeInSeconds * Math.PI) / 1);
}

function Eye(props: { position: ReturnType<typeof Vector3> }) {
  return (
    <Group rotation={Vector3(-10, 0, 0)} position={props.position}>
      <Sphere radius={28} fill={Color(255, 255, 255)} stroke={Color(0, 0, 0)} strokeWidth={2} />
      <Sphere radius={10} position={Vector3(0, 0, 25)} fill={Color(0, 0, 0)} stroke={Color(0, 0, 0)} strokeWidth={0} />
    </Group>
  );
}

function LegSegment(props: { heights: number[]; index: number; curlDegrees: number }) {
  const h = props.heights[props.index];
  const nextIndex = props.index + 1;
  const hasNext = nextIndex < props.heights.length;

  return (
    <Group id={`LegSegment-${props.index}`} position={Vector3(0, props.index === 0 ? 0 : props.heights[props.index - 1], 0)} rotation={Vector3(0, 0, props.index === 0 ? 0 : props.curlDegrees)}>
      <Cylinder
        position={Vector3(0, h / 2, 0)}
        fill={BodyColor}
        stroke={Color(0, 0, 0, 0)}
        height={h}
        radius={h / 4}
      />
      {hasNext ? (
        <LegSegment heights={props.heights} index={nextIndex} curlDegrees={props.curlDegrees} />
      ) : null}
    </Group>
  );
}

function Leg(props: { curlDegrees: number; rotationY: number }) {
  const heights = [200, 170, 150, 120, 100].map((a) => a * 0.7);
  return (
    <Group id="Leg" rotation={Vector3(90, props.rotationY, 0)}>
      <LegSegment heights={heights} index={0} curlDegrees={props.curlDegrees} />
    </Group>
  );
}

export function OctopusScene({ now }: { now: number }) {
  const legRotationSpeedPerSecond = 1.0;
  const maxLegCurlDegreesAbsolute = 15;
  const legCurlDegrees = maxLegCurlDegreesAbsolute * pingPongTime(legRotationSpeedPerSecond, now);

  const legCount = 8;

  return (
    <Group id="Octopus" position={Vector3(0, 0, 0)}>
      <Sphere position={Vector3(0, 150, 0)} fill={BodyColor} radius={150} strokeWidth={0} />
      <Group id="Eyes" position={Vector3(0, 150, 0)}>
        <Eye position={Vector3(50, 0, 150)} />
        <Eye position={Vector3(-50, 0, 150)} />
      </Group>
      {Array.from({ length: legCount }).map((_, i) => (
        <Leg key={i} curlDegrees={legCurlDegrees} rotationY={(i / legCount) * 360} />
      ))}
    </Group>
  );
}


