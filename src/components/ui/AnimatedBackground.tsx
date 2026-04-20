"use client";

import React from "react";
import { ParticleNetwork } from "./ParticleNetwork";

export function AnimatedBackground() {
  return (
    <div className="animated-bg">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <ParticleNetwork />
    </div>
  );
}
