import { forwardRef, useImperativeHandle, useState } from 'react';

const Togglable = forwardRef(function Togglable(props, ref) {
  const [expand, setExpand] = useState(false);

  useImperativeHandle(ref, () =>
  ({
    toggleSelf: () => {
      console.log(`Toggling "expand" from ${expand} to ${!expand}`)
      setExpand(!expand)
      return !expand
    },
  })
    , [expand])

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
})

export default Togglable