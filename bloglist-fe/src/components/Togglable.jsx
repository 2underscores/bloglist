import { useState } from 'react';

function Togglable(props) {
  const [expand, setExpand] = useState(false);


  return (
    <div>
      {expand && <div>
        <button onClick={() => { setExpand(false) }}>Cancel</button>
        {props.children}
      </div>}
      {!expand && <div>
        <button onClick={() => { setExpand(true) }}>{props.buttonName}</button>
      </div>}
    </div>
  )
}

export default Togglable