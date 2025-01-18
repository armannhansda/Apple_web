import React from 'react'
import { hightlightsSlides } from '../constants'

export const VideoCarousel = () => {
  return (
    <>
      <div
        className='flex items-center'
      >
        {hightlightsSlides.map((navLists,i) =>{
          <div></div>
        })}
      </div>
    </>
  )
}
