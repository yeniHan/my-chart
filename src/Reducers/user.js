const initialState = {
    email: null,
    pdfInfos: [],
    successEmailExecution: false
}

const user = (state = initialState , action) =>  {
    switch(action.type){
        case 'ADD_PDF_INFO':
            console.log('ADD_PDF_INFO')

            return Object.assign({}, {...state, pdfInfos: state.pdfInfos.concat([action.pdfInfo])})

        case 'DELETE_PDF_INFO':
            return Object.assign({}, {...state, pdfInfos: state.pdfInfos.filter((p) => p.id !== action.id )})
        
        case 'INPUT_EMAIL':
            return Object.assign({}, {...state, email: action.email})

        case 'SUCCESS_EMAIL_EX':
            return Object.assign({}, {...state, successEmailExecution: true})

        case 'FAILURE_EMAIL_EX':
            return Object.assign({}, {...state, successEmailExecution: false})


        default:
            return state
    }
}   

export default user;