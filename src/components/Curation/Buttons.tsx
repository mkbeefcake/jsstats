import React from 'react'
import { Button } from 'react-bootstrap'

const Buttons = (props) => {
  const { show, addVideoVote, id } = props
  if (!show) return <div />
  return (
    <div>
      <Button
        className="p-1 btn btn-small"
        variant="danger"
        onClick={() => addVideoVote(id, 'censor')}
      >
        CENSOR
      </Button>
      <Button
        className="p-1 mx-1 btn btn-small"
        variant="success"
        onClick={() => addVideoVote(id, 'approve')}
      >
        Approve
      </Button>
    </div>
  )
}

export default Buttons
