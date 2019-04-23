import React from 'react';
import { connect } from 'react-redux';
import { deletePdfInfo } from '../Actions/actionCreators';
import './StoredChart.css';

const StoredChart =  (props) => {

    let { id, gType, chartname, deletePdfInfo } =  props 
    console.log("StoredChart id:", id)
    return <div className={gType}>{gType}<div className="chartname">{chartname}</div><i className="fas fa-times delete-btn" id={'stored-chart-delete-btn-' + id}  onClick={() => deletePdfInfo(id)}></i></div>
}


const mapStateToProps = (state) =>({

})
const mapDispatchToProps = (dispatch) => ({
    deletePdfInfo: (id) => dispatch(deletePdfInfo(id))
})

export default connect(mapStateToProps, mapDispatchToProps)( StoredChart);