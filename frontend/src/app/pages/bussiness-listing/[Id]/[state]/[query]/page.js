import React, { Suspense } from 'react'
import Businesslistings from '../../../../../Components/Businesslistingcomp/Businesslisting'
import LoadingComponent from '../../../../../Components/loadingcomponent/Loadingcomponent'
const page = () => {
  return (
    <>
    <Suspense fallback={<div><LoadingComponent /></div>}>
    <Businesslistings />
    </Suspense>
    </>
  )
}

export default page