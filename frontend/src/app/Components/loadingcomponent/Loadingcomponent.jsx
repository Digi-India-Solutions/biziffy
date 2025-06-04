import React from 'react'
import './loadingcomponent.css'
const Loadingcomponent = () => {
  return (
    <>
      <div id="loadcontainer">
        <div className="loadbox" id="loader1"></div>
        <div className="loadbox" id="loader2"></div>
        <div className="loadbox" id="loader3"></div>
        <div className="loadbox" id="loader4"></div>
        <div className="loadbox" id="loader5"></div>
      </div>;
    </>
  )
}

export default Loadingcomponent