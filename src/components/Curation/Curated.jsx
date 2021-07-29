import React from 'react'
import { Badge } from 'react-bootstrap'

const Curated = (props: { curations: any[], videoId: number }) => {
  const { curations, videoId } = props
  const existing = curations.filter((c) => c.videoId === videoId)
  if (!existing.length) return <div />
  const variants = { approve: 'success', censor: 'danger' }
  const strings = { approve: `approved`, censer: `censored` }
  return (
    <>
      {existing.map(({ id, vote, memberId }) => (
        <Badge key={id} variant={variants[vote]} className="ml-2">
          {strings[vote]} by {memberId}
        </Badge>
      ))}
    </>
  )
}

export default Curated
