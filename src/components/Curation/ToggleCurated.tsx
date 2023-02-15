import React from 'react'
import { Button } from 'react-bootstrap'

const ToggleCurated = (props: { curations: number, toggle: () => void }) => {
  if (!props.curations) return <div />
  return (
    <Button
      variant="secondary"
      className="btn-sm float-right"
      onClick={() => props.toggle()}
    >
      Toggle curated
    </Button>
  )
}
export default ToggleCurated
