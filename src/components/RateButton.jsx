import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faStar,
} from '@fortawesome/free-solid-svg-icons'

import {
  faStar as faStarHollow
} from '@fortawesome/free-regular-svg-icons'

import { useState } from 'react';


export function RateButton({ onClick, value, selectable = true, rate }) {
  const [isHiglight, setIsHiglight] = useState(false);
  let icon = isHiglight || rate >= value ? faStar : faStarHollow

  return (
    <div
      className='text-warning'
      onMouseEnter={() => setIsHiglight(true)}
      onMouseLeave={() => setIsHiglight(false)}
      style={{ cursor: 'pointer', pointerEvents: `${selectable ? 'initial' : 'none'}` }}
      onClick={() => { onClick(value) }}
    >
      <FontAwesomeIcon icon={icon} />
    </div>
  )
}