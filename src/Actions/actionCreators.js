
export const addPdfInfo = ( id, chartname, gType, blob) => {
   
   console.log('addPdfInfo()')
    console.log('blob:', blob)
   console.log('charname:', chartname)

    return {
        type: 'ADD_PDF_INFO',
        pdfInfo: { id: id, gType: gType, chartname: chartname, blob: blob }
    }
}

export const deletePdfInfo = ( id) => {
    console.log('deletePdfInfo(), id:', id)
    return {
        type: 'DELETE_PDF_INFO',
        id:  id 
    }
}

export const inputEmail = (email) => {
    return {
        type: 'INPUT_EMAIL',
        email: email
    }

}

export const successEmailEx = () => {
    return {
        type: 'SUCCESS_EMAIL_EX'
    }
}

export const failureEmailEx = () => {
    return {
        type: 'FAILURE_EMAIL_EX'
    }
}


export const asyncSendPdfs = () => {
    return function (dispatch, getState){
        let state  = getState()
        let {pdfInfos, email} = state
        console.log('asyncSendPdf() email:', email)


        let formD = new FormData()
        pdfInfos.forEach((pdfInfo) => {
            let chartname = pdfInfo.chartname === null? '': '_' + pdfInfo.chartname
            formD.append(`${email}_${pdfInfo.id}${chartname}_${pdfInfo.gType}`, pdfInfo.blob)
        })

        formD.append('email', email)

        fetch('http://localhost:8080/sendPDFs', {
            method: 'POST',
            body: formD
        })
        .then((res) => {
            if(!res.ok){
                dispatch(failureEmailEx())
            }
            return res.json()
        })
        .then(json => {
            if(!json.error){
                dispatch(failureEmailEx())
            }else{
                dispatch(successEmailEx())
            }
        })
    }

}