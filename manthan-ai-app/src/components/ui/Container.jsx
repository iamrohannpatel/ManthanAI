import React, { forwardRef } from 'react'

const Container = forwardRef(function Container({ className = '', children }, ref) {
  return (
    <div ref={ref} className={`mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
})

export default Container
