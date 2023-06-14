import React from "react"
import { useSelector } from "react-redux"

const LayoutService = () => {
    const lineHeight = Number(useSelector((state) => state.lineHeight))
    const fontSize = Number(useSelector((state) => state.fontSize))

    function customStylesDataTable() {
        return {
            headCells: {
                style: {
                    fontSize: fontSize
                },
            },
            cells: {
                style: {
                    fontSize: fontSize
                },
            },
            rows: {
                style: {
                    cursor: 'pointer'
                }
            }
        }
    }

    return {
        customStylesDataTable
    }
}

export default LayoutService