'use client';

// These components wrap the main SocialMediaResizerTool to prepopulate the correct default initialPresetId
// depending on which dedicated SEO routing they entered from. This satisfies the "Search Intent Clusters" rule
// without duplicating codebase logic.

import React from 'react';
import { SocialMediaResizerTool } from './SocialMediaResizerTool';

export function InstagramResizerTool() {
  return <SocialMediaResizerTool initialPresetId="ig-square" />;
}

export function YouTubeResizerTool() {
  return <SocialMediaResizerTool initialPresetId="yt-thumbnail" />;
}

export function LinkedInResizerTool() {
  return <SocialMediaResizerTool initialPresetId="li-post" />;
}

export function FacebookResizerTool() {
  return <SocialMediaResizerTool initialPresetId="fb-post" />;
}

export function WhatsAppResizerTool() {
  return <SocialMediaResizerTool initialPresetId="wa-dp" />;
}

export function TwitterResizerTool() {
  return <SocialMediaResizerTool initialPresetId="x-post" />;
}

export function PinterestResizerTool() {
  return <SocialMediaResizerTool initialPresetId="pin-standard" />;
}
