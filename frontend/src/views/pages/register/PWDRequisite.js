/* eslint-disable react/prop-types */
import React from 'react'

export default function PDWRequisite({
  capsLettersFlag,
  lowerCaseFlag,
  numFlag,
  lenFlag,
  specialCharFlag,
}) {
  return (
    <div className="req-pass">
      <p className={capsLettersFlag}>1 Mayuscula</p>
      <p className={lowerCaseFlag}>1 Minuscula</p>
      <p className={numFlag}>1 Numero</p>
      <p className={lenFlag}>8 caracteres</p>
      <p className={specialCharFlag}>1 Caracter especial</p>
    </div>
  )
}
