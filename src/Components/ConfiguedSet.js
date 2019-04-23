import React from 'react';


const ConfiguedSet =  (props) => {
    let { id, idx, label,  value, deletePieSet } =  props 
    return <div className="line-config">{idx + 1}. Label : {label} Value: {value} <i className="fas fa-times delete-btn" id={'pie-config-delete-btn-' + id}  onClick={deletePieSet}></i></div>
}

export default ConfiguedSet;