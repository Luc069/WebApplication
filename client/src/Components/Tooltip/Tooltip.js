import React from "react"

import Tippy from "@tippyjs/react"

import "tippy.js/dist/tippy.css"

const Tooltip = (props) => {
  return <Tippy content={props.content}>{props.element}</Tippy>
}

export default Tooltip
