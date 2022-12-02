import React from 'react'

const SelectDropdown = ({type, options, fieldName}) => {
    return (
        <select className="form-control form-select" name={fieldName}>
            <option value="">--Select--</option>
            {options.map((optionValue,idx) => (
                <option value={optionValue} key={idx}>{optionValue}</option>
            ))}
        </select>
    )
}

export default SelectDropdown