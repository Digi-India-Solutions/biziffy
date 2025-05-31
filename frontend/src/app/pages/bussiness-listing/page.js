import React, { Suspense } from 'react'
import Businesslistings from '../../Components/Businesslistingcomp/Businesslisting'
const page = () => {
  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
    <Businesslistings />
    </Suspense>
    </>
  )
}

export default page