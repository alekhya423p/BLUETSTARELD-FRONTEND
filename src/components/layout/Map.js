import {useEffect } from "react";

const Map =(props)=> {
 
 const onScriptLoad = () => {
    const map = new window.google.maps.Map(document.getElementById(props.id),props.options);
    props.onMapLoad(map)
  }

  useEffect(()=>{
    if (!window.google) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.google.com/maps/api/js?key=AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo`;
      script.id = 'googleMaps';
      document.body.appendChild(script);
      script.addEventListener('load', e => {
        onScriptLoad()
      })
    } 
    else {
      onScriptLoad()
    }
  });


    return (
      <div style={{ width: 500, height: 500 }} id={props.id} />
    );
}

export default Map;