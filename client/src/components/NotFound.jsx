import React from 'react'
import {ContentFormat, SidebarCombiner} from "../Utils"

export default function NotFound() {
  const content = 
    <h2 className="w3-col w3-margin-left w3-margin-right w3-center m8 l8">404 Not Found</h2>

  return (
    ContentFormat(SidebarCombiner(content))
  )
}
