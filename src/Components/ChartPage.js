import React, {useCallback} from 'react';
import './ChartPage.css';
import FileDrop from 'react-file-drop';
import configForms from '../Constants/configForms';
import * as jsPDF   from 'jspdf';
import  html2canvas  from 'html2canvas';
import { connect } from 'react-redux';
import fs from 'fs';
// import b64toBlob from '../Utils/b64toBlob';
import dataURItoBlob from '../Utils/dataURItoBlob';

///action creators
import { addPdfInfo } from '../Actions/actionCreators';


////Chart library
import ReactFC from 'react-fusioncharts';
import FusionCharts from 'fusioncharts';
import Column2D from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

////Components
import ConfiguedSet from './ConfiguedSet'
import StoredChart from './StoredChart'

ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);



class ChartPage extends React.Component{
    state = {
        example: null,
        chartKind: null,
        dataArr: null,
        nonNumericKinds: null,
        numericKinds: null,
        filename: null,
        config: {
            bar:{
                identifier: null,
                yAxis: null,
                caption: null,
                subCaption: null,
                xAxisName: null,
                yAxisName: null,
                numberSuffix: null,
            },
            line: {
                xAxis: null,
                yAxis: null,
                axisSets: [], 
                caption: null,
                subCaption: null,
                xAxisName: null,
                yAxisName: null,
                numberSuffix: null,
                average:false
            },
            pie: {
                id: 0,
                label: '',
                value: '',
                LnVSets: [],
                caption: null,
                subCaption: null,
                numberSuffix: null,
                showPercentValues: true,
                percentage: false,
            },
            map: {
                countryCode: null,
                key: null
            }

        },
        gType: 'bar',
        configForms: {
            bar:null,
            line: null,
            pie: null
        },
        blobId: 0,
        pdfSize: {
            width: 700,
            height: 473
        },
        pdfSizeSettingPopupFlag: false
    }

    selectExample = (e) => {
        let example = e.target.id
        console.log( 'which example was selected?:', example )
        // const fs = require('fs')
        // console.log('fs:',fs)
        const reader = new FileReader()
        reader.readAsText(__dirname + '\\Examples\\' + example)
        reader.onload = async (event) => {
            let content = event.target.result
            let dataArr = JSON.parse(content)
            console.log('exmaple content:',content)

            let nonNumericKinds = []
            let numericKinds = []
             Object.keys(dataArr[0]).forEach(kind => {
                if( typeof dataArr[0][kind] === "string"){
                    nonNumericKinds.push(kind)
                }else{
                    numericKinds.push(kind)
                }
            })

            this.setState({
                ...this.state,
                filename: example,
                nonNumericKinds: nonNumericKinds,
                numericKinds: numericKinds,
                dataArr: dataArr
            })
            
        }
        // let content = fs.readFileSync(__dirname + '\\Examples\\' + example, 'utf8')
        

        


    }

   
    holdFile =  (files, ev) => {
        console.log('holdFile()')
        let vm = this
        const dropzoneText = document.getElementById('dropzone-text')
        console.log('file', files)
        if(files.length === 1){
            let file = files[0]
            
            const reader = new FileReader()
            let dataArr = null
            // let readFileP = new Promise((resolve, reject) => {
            reader.readAsText(file)
            reader.onload = async (event) => {
                try{
                    //If the data file is not valid..
                    // - Not valid form;  [ {...}, {... }, ... , {...}]
                    // - Not valid extentsions( .json or .txt)
                    console.log(JSON.parse(event.target.result))
                    dataArr =  JSON.parse(event.target.result)

                    let nonNumericKinds = []
                    let numericKinds = []
                     Object.keys(dataArr[0]).forEach(kind => {
                        if( typeof dataArr[0][kind] === "string"){
                            nonNumericKinds.push(kind)
                        }else{
                            numericKinds.push(kind)
                        }
                    })

                    dropzoneText.innerHTML = '<div id="filename">File: ' + file.name + '</div><div id="dropzone-guide">Choose the graph type and its configuration.</div>'
                    
                    console.log('dataArr:', dataArr)
                    await vm.setState({...this.state, filename: file.name, dataArr: dataArr, nonNumericKinds: nonNumericKinds, numericKinds: numericKinds})

                    const barConfigSelector = document.querySelector('#config-bar-selector')
                    barConfigSelector.click()
                    console.log('barConfig:', barConfigSelector)
                    

                }catch(error){
                    // alert('Invalid file form or extension.')
                    dropzoneText.innerHTML = '<div><div id="file-validation-result">Invalid extension or format of the file.</div></div>'
                }

            }

        


          
        }else{
            dropzoneText.innerHTML = '<div><div id="file-validation-result">Invalid file.</div><div id="error-message">You can drop only one file.</div></div>'
        }
    }

    fileInputChangeHandler = (e) => {
        let vm = this
        console.log('file:', e.target.files)

        const dropzoneText = document.getElementById('dropzone-text')
        if(e.target.files.length === 1){
            let file = e.target.files[0]
            
            const reader = new FileReader()
            let dataArr = null
            reader.readAsText(file)
            reader.onload = async function (ev){
                try{
                    //If the data file is not valid..
                    // - Not valid form;  [ {...}, {... }, ... , {...}]
                    // - Not valid extentsions( .json or .txt)
                    console.log(JSON.parse(ev.target.result))
                    dataArr =  JSON.parse(ev.target.result)

                    dropzoneText.innerHTML = '<div id="filename">File: ' + file.name + '</div><div id="dropzone-guide">Choose the graph type and its configuration.</div>'
                
                    let nonNumericKinds = []
                    let numericKinds = []
                     Object.keys(dataArr[0]).forEach(kind => {
                        if( typeof dataArr[0][kind] === "string"){
                            nonNumericKinds.push(kind)
                        }else{
                            numericKinds.push(kind)
                        }
                    })

                    await vm.setState({...vm.state, filename: file.name, dataArr: dataArr, nonNumericKinds: nonNumericKinds, numericKinds: numericKinds})
                    const barConfigSelector = document.querySelector('#config-bar-selector')
                    barConfigSelector.click()
                    console.log('barConfig:', barConfigSelector)

                }catch(error){
                    // alert('Invalid file form or extension.')
                    dropzoneText.innerHTML = '<div><div id="file-validation-result">Invalid file.</div><div id="error-message">The extention of the file should be <b>.json</b> or <b>.txt</b> and should have a valid form(an array of objects).</div></div>'
                }

            }

          
        }else{
            dropzoneText.innerHTML = '<div><div id="file-validation-result">Invalid file.</div><div id="error-message">You can drop only one file.</div></div>'
        }

    }

    setSelection = (e = 'example') => {
        let gType = e.target.id.split('-')[1]
        console.log('gType:', gType)



        if(this.state.filename === null ){
            this.setState({
                ...this.state,
                gType: gType
            })

            
        }else{
            //Filter possible keys for each config factor


            let keys = Object.keys(this.state.dataArr[0])
            let {nonNumericKinds, numericKinds} = this.state

            if(gType === 'bar'){

                let identifierSelect = document.getElementById( gType + "-identifier-select")
                let yAxisSelect = document.getElementById( gType + "-yAxis-select")
                identifierSelect.innerHTML = ''
                yAxisSelect.innerHTML = ""

                keys.forEach((key, i) => {
                    identifierSelect.innerHTML += '<option>' + key + '</option>'
                })
                numericKinds.forEach((key, i) => {
                    yAxisSelect.innerHTML += '<option>' + key + '</option>'
                })

                //Set the default values for the selection 
                //for the situation where a user clicked on the display button without selecting axis & identifier. 
                this.setState({
                    ...this.state,
                    gType: gType,
                    config: {
                        ...this.state.config,
                        bar: {
                            ...this.state.config.bar,
                            identifier: keys[0],
                            yAxis: numericKinds[0]
                        }
                    }
                
                })

            }else if(gType === 'line'){
                let xAxisSelect = document.getElementById( gType + "-xAxis-select")
                let yAxisSelect = document.getElementById( gType + "-yAxis-select")
                xAxisSelect.innerHTML = ''
                yAxisSelect.innerHTML = ''

                keys.forEach((key, i) => {
                    xAxisSelect.innerHTML += '<option>' + key + '</option>'
                })
                numericKinds.forEach((key, i) => {
                    yAxisSelect.innerHTML += '<option>' + key + '</option>'
                })

                this.setState({
                    ...this.state,
                    gType: gType,
                    config: { 
                        ...this.state.config,
                        line: {
                            ...this.state.config.line,
                            xAxis: keys[0],
                            yAxis: numericKinds[0]
                        }
                    }
                })
            }
            else if(gType === 'pie'){

                this.setState({
                    ...this.state,
                    gType: gType
                })

            }
            else if(gType === 'map'){
                let countryCodeSelect = document.getElementById( gType + "-countryCode-select")
                let keySelect = document.getElementById( gType + "-key-select")
                countryCodeSelect.innerHTML = ''
                keySelect.innerHTML = ''

                nonNumericKinds.map((key) => {
                    countryCodeSelect.innerHTML += '<option>' + key + '</option>'
                })

                console.log(this.state.numericKinds)
                numericKinds.map((key) => {
                    keySelect.innerHTML += '<option>' + key + '</option>'
                })

            }
        }
    } 

    displayMap = (e) => {
        console.log('Here')
        console.log('displayMap()')

        // 1.Generate a data array => 2. create a full configuration for its chart!!

        let gType = e.target.id.split('-')[0]
        let gTypeConfig = this.state.config[gType]
        let { dataArr } = this.state
        let data = []
        let configForm = configForms[gType]

        console.log('gType:', gType)
        let identifier = null
        let xAxis = null
        let yAxis = null
         
        //  1.Generate a data array   

        if(gType === 'bar'){
            identifier = gTypeConfig.identifier
            yAxis = gTypeConfig.yAxis
            console.log('identifier:', identifier)
            console.log('yAxis:', yAxis)

            data = dataArr.map((d) => {
                return { "label": d[identifier] , "value": d[yAxis] }
            })
            configForm.dataSource.chart = {
                ...configForm.chart,
                "caption": gTypeConfig.caption === null? this.state.filename: gTypeConfig.caption,
                "subCaption": gTypeConfig.subCaption === null? '' : gTypeConfig.subCaption,
                "xAxisName": gTypeConfig.xAxisName === null? gTypeConfig.identifier: gTypeConfig.xAxisName,
                "yAxisName": gTypeConfig.yAxisName === null? gTypeConfig.yAxis: gTypeConfig.yAxisName,
                "numberSuffix": gTypeConfig.numberSuffix === null? '' : gTypeConfig.numberSuffix
            }
        }
        else if( gType === 'line'){
            xAxis = gTypeConfig.xAxis
            yAxis = gTypeConfig.yAxis
            console.log('xAxis:', xAxis)
            console.log('yAxis:', yAxis)

            data = dataArr.map((d) => {
                return { "label": d[xAxis] , "value": d[yAxis] }
            })
            configForm.dataSource.chart = {
                ...configForm.chart,
                "caption": gTypeConfig.caption === null? this.state.filename: gTypeConfig.caption,
                "subCaption": gTypeConfig.subCaption === null? '' : gTypeConfig.subCaption,
                "xAxisName": gTypeConfig.xAxisName === null? gTypeConfig.xAxis: gTypeConfig.xAxisName,
                "yAxisName": gTypeConfig.yAxisName === null? gTypeConfig.yAxis: gTypeConfig.yAxisName
            }
            if(gTypeConfig.average === false){
                configForm.dataSource["trendLines"] = []
            }
        }
        else if( gType ===  'pie'){
           let {LnVSets } = this.state.config.pie
            data = LnVSets.map(set =>  {return { "label": set.label, "value": set.value.toString()}})

            configForm.dataSource.chart = {
                ...configForm.chart,
                "caption": gTypeConfig.caption === null? this.state.filename: gTypeConfig.caption,
                "subCaption": gTypeConfig.subCaption === null? '' : gTypeConfig.subCaption,
                "showPercentValues": gTypeConfig.percentage === true ? "1" : "0",
                "numberSuffix": gTypeConfig.numberSuffix === null? '' : gTypeConfig.numberSuffix
            }

        }
        // else if( gType === 'map'){
        //     let {countryCode, key} = this.state.config.map

        //     //1. Create a country code arr => 2. Sum of the values of the key by country 
        //     let countryCodes = []
        //     for(let i =0; i < dataArr.length;i++ ) {
        //         let thisCountryCode = dataArr[i][countryCode]
        //        if(countryCodes.indexOf(thisCountryCode) === -1 ) {
        //             console.log(thisCountryCode)
        //             countryCodes.push(thisCountryCode)
        //        }
        //     }
        //     console.log('countryCodes:', countryCodes)

        //     countryCodes.forEach(c => {
        //         let value = 0
        //         dataArr.forEach((d) => {
        //             if(d[countryCode] === c) {
        //                 value += d[key]
        //             }
        //         })
        //         data.push({"label": c, "value": value})
        //     })

        //     console.log('data:', data)

            
        // }

        configForm.dataSource.data = data

        //2. Fill the full configuration for the chart
        console.log('configForm:', configForm)
        let stateConfigForms = this.state.configForms
        stateConfigForms[gType] = configForm
        

        this.setState({
            ...this.state,
            configForm: {
                ...stateConfigForms
            }
        })

    }

    setConfig = (e) => {


        let gType = e.target.id.split('-')[0]
        let factor = e.target.id.split('-')[1]
        let config = this.state.config
        let value = e.target.value

        console.log('setConfig()')
        console.log('value:', value)
        console.log('factor:', factor)
        console.log('checked:', e.target.checked)

        // if(gType === 'bar'|| gType === 'line'){
            let gTypeConfig = this.state.config[gType]
            gTypeConfig[factor] = value
            config[gType] = gTypeConfig

        if(factor === 'average'|| factor === 'percentage'){
            gTypeConfig[factor] = e.target.checked
            
        }



        this.setState({
            ...this.state,
            gType: gType,
            config: config
        })        
        
    }

    /////////For a pie chart
    addPieSet = () => {
        console.log('addPieSet()')
        let { id, label, value } = this.state.config.pie
        id = id + 1
        this.setState({
            ...this.state,
            config: {
                ...this.state.config,
                pie: {
                    ...this.state.config.pie,
                    id: id,
                    LnVSets: this.state.config.pie.LnVSets.concat([{id: id, label: label, value: value}])
                }
            }
        })
        
    }

    deletePieSet= (e) => {
        let id = parseInt(e.target.id.split('-')[4])
        console.log('deletePieSet(), id:', id )
        this.setState({
            ...this.state,
            config: {
                ...this.state.config,
                pie: {
                    ...this.state.config.pie,
                    LnVSets: this.state.config.pie.LnVSets.filter((set) => set.id !== id )
                }
            }
        })


    }

    storeAsPDF = async(e) => {
        let blob = null
        let { gType } = this.state
        let { width, height } = this.state.pdfSize

        await this.togglePdfSizeSettingPopupFlag(false)

		await html2canvas(document.querySelector(`#${gType}-react-fc`)).then(canvas => {
            let pdf = new jsPDF('p', 'mm', 'a4');
            
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, width, height);
            let imgURI =  pdf.output('datauristring')
            //Convert uri to blob 
            blob = dataURItoBlob(imgURI)
            console.log(blob)

        })

        let id = this.state.blobId + 1
        let chartname = this.state.config[gType].caption === null?  this.state.filename: this.state.config[gType].caption
        this.props.addPdfInfo(id, chartname, gType, blob)


        this.setState({
            ...this.state,
            blobId: id
        })
        
    }

    downloadPDF = (e) => {
        const gType = e.target.id.split('-')[0]
        let { caption } = this.state.config[gType]
        let filename = caption
        if(caption == null ){

            filename = this.state.filename === null ? '' : this.state.filename

        }

		html2canvas(document.querySelector(`#${gType}-react-fc`)).then(canvas => {
            let pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 120);
            pdf.save(`${filename}_${gType}.pdf`)
        })
    }

    onChangePDFSize = (e) => {
        let factor = e.target.id.split('-')[0]
        let { pdfSize } = this.state
        pdfSize[factor] = e.target.value
        console.log('factor:', factor)
        this.setState({
            ...this.state,
            pdfSize: pdfSize
        })
    }

    togglePdfSizeSettingPopupFlag = (flag) => {
        console.log('flag:', flag)
        if(this.props.pdfInfos.length > 10){
            console.log('Stored pdfs are more than 10')
            alert('You can store less than 10 files.')

        }else{        
            this.setState({
                ...this.state,
                pdfSizeSettingPopupFlag: flag
            })
        }
        // let factor = e.target.id.split('-')[0]
        // console.log('factor:', factor)
    }




    render(){
        console.log('render() state:', this.state)
        let { LnVSets } = this.state.config.pie
        let configuedSets = LnVSets.map((set, idx) => {
                return <ConfiguedSet idx={idx} key={set.id} label={set.label} value={set.value} id={set.id} deletePieSet={this.deletePieSet}/>
        })
            
        console.log(this.props)
        let { pdfInfos } = this.props
        let storedCharts = pdfInfos.map(p => {
           return  <StoredChart key={p.id} id={p.id} gType={p.gType} chartname={p.chartname}/>
        }) 

        let {filename, configForms, gType, pdfSizeSettingPopupFlag} = this.state

        //Chart hiding
        let barChStyle = configForms.bar === null? {display: "none"}: {}
        let lineChStyle = configForms.line === null? {display: "none"}: {}
        let pieChStyle = configForms.pie === null? {display: "none"}: {}
        let mapChStyle = configForms.map === null? {display: "none"}: {}
        let barConStyle = gType !== 'bar'? {display: "none"}: {}
        let lineConStyle = gType !== 'line'? {display: "none"}: {}
        let pieConStyle = gType !== 'pie'? {display: "none"}: {}
        
        //Selector chapter effect
        let barSelStyle = gType === 'bar'? {background: "white"}: {}
        let lineSelStyle = gType === 'line'? {background: "white"}: {}
        let pieSelStyle = gType === 'pie'? {background: "white"}: {}

        console.log('before render(), gType:', gType)

        
        // PdfSizeSettingPopup flag
        let pdfSizeSettingPopupStyle = pdfSizeSettingPopupFlag === false ? {display: "none"}:{}


        return (

            <div id="chart-page">
                <div id="pdf-size-setting-popup-background"  style={pdfSizeSettingPopupStyle}>
                    <div id="pdf-size-setting-popup">
                        <div id="pdf-size-setting-popup-title">Set the size of the pdf file.</div>
                        <div className="input-box">
                            <span>Width</span><input id="width-pdf-size" type='number' defaultValue="210" onChange={this.onChangePDFSize}></input>
                        </div>
                        <div className="input-box">
                            <span>Height</span><input id="height-pdf-size" type='number' defaultValue="120" onChange={this.onChangePDFSize}></input>
                        </div>
                        <button id="pdf-size-setting-popup-set-btn" onClick={this.storeAsPDF}>Store the PDF with this setting</button>
                    </div>
                </div>
                <div id="explination">
                    <b>"My Chart"</b> is a simple application for visualizaing data.<br/>
                    If you have a DB and you can retreive the data in <span id="json-emphasis"><u>*JSON</u></span>,<br/>
                    you can visualize them with different kinds of charts!<br/>
                    It'll help you to understand more deeply about your data.<br/>
                    <br/>
                    <div>Requirements</div>
                    <div>1. A file extension should be <b className="exp-em">.json</b> or <b className="exp-em">.txt</b>.</div>
                    <div>2. The data should be <b className="exp-em">an array of objects in JSON format</b>.</div>
                </div>

                <div id="how-to">
                </div>

                <div id="drop-box" >
                    <FileDrop onDrop={this.holdFile}>
                      <div id="dropzone-text">Drop a data file or select a file.</div>
                      <div><i className="fab fa-dropbox"></i></div>
                      <input type="file" onChange={this.fileInputChangeHandler} accept=".json, .txt"></input>
                    </FileDrop>
                </div>
                
                <div id="example-selection">
                    <div id="example-selection-title">Try it with any of these example.</div>
                    <div className="example" id="immigration.json" onClick={this.selectExample}>Immigration population of the Maryland</div>
                    <div className="example" id="customer.txt" onClick={this.selectExample}>Customers(Payments, Residence info, etc)</div>
                    <div className="example" id="exameple3" onClick={this.selectExample}></div>
                </div>
 

                <div id="display-container">
                    <div id="selectors">
                        <button style={barSelStyle} className="selector"  id="config-bar-selector" onClick={this.setSelection}>BAR</button>
                        <button style={lineSelStyle} className="selector"  id="config-line-selector" onClick={this.setSelection}>LINE</button>
                        <button  style={pieSelStyle} className="selector" id="config-pie-selector" onClick={this.setSelection}>PIE</button>
                    </div>
                    
                    <div className="config-n-chart-container" id="cncc-bar" style={barConStyle}>
                        <div className="chart" id="bar-react-fc"><div style={barChStyle} ><ReactFC {...this.state.configForms.bar}/></div></div>
                        <div className="config-box" id="config-bar">
                            <div className="config-guide">
                                <div className="guide-text">Please set the configuration</div>     
                                <div className="note">
                                    <div className="note-title">[NOTE]</div>
                                    <div className='note-content'>
                                        - Y axis should be <u>numeric value.</u><br/>
                                        - <b>identifier</b> and <b>Y axis</b> must be selected.
                                    </div>

                                </div>
                            </div>    

                            <div className="required-config"> 
                                <div className="required-title">Required</div>
                                <div className="required-selectors">
                                    <div className="select-box"><span>identifier</span><select id="bar-identifier-select" onChange={this.setConfig}></select></div>
                                    <div className="select-box"><span>Y axis</span><select id="bar-yAxis-select" onChange={this.setConfig}></select></div>
                                </div>
                            </div>
                            <div className="optional-config">
                                <div className="optional-title">Optional</div>
                                <div className="input-box">
                                    <span>Caption</span><input id="bar-caption-input" type='txt' onChange={this.setConfig}></input>
                                </div>
                                <div className="input-box">
                                    <span>Subcaption</span><input id="bar-subCaption-input" type='txt' onChange={this.setConfig}></input>
                                </div>
                                <div className="input-box">
                                    <span>X axis name</span><input id="bar-xAxisName-input" type='txt' onChange={this.setConfig}></input>
                                </div>
                                <div className="input-box">
                                    <span>Y axis name</span><input id="bar-yAxisName-input" type='txt' onChange={this.setConfig}></input>
                                </div>
                                <div className="input-box">
                                    <span>Y axis number suffix</span><input id="bar-numberSuffix-input" type='txt' onChange={this.setConfig}></input>
                                </div>
                            </div>
                            <div className="config-buttons">
                                <button className="display-btn" disabled={filename === null? true: false} id="bar-display-btn" onClick={this.displayMap}>Display</button>
                                <button disabled={filename === null? true: false } className="store-btn" id="bar-store-btn" onClick={() =>  this.togglePdfSizeSettingPopupFlag(true)}>Store</button>
                                <button disabled={filename === null? true: false } className="download-btn" id="bar-download-btn" onClick={this.downloadPDF}>Download</button>
                            </div>
                        </div>
                    </div>



                    <div className="config-n-chart-container" id="cncc-line" style={lineConStyle}>
                        <div className="chart" id="line-react-fc"><div style={lineChStyle}><ReactFC {...this.state.configForms.line}/></div></div>
                        <div className="config-box" id="config-line">

                            <div className="config-guide">
                                <div className="guide-text">Please set the configuration</div>     
                                <div className="note">
                                    <div className="note-title">[NOTE]</div>
                                    <div className='note-content'>
                                        - Y axis should be <u>numeric value</u>.<br/>
                                        - <b>X axis</b> and <b>Y axis</b> must be selected.
                                    </div>

                                </div>
                            </div>    

                            <div className="required-config"> 
                                <div className="required-title">Required</div>
                                <div className="required-selectors">
                                    <div className="select-box"><span>X axis</span><select id="line-xAxis-select" onChange={this.setConfig}></select></div>
                                    <div className="select-box"><span>Y axis</span><select id="line-yAxis-select" onChange={this.setConfig}></select></div>
                                </div>

                            </div>
                            <div className="optional-config">
                                <div className="optional-title">Optional</div>
                                <div className="input-box">
                                    <span>Caption</span><input id="line-caption-input" type='txt' onChange={this.setConfig}></input>
                                </div>
                                <div className="input-box">
                                    <span>Subcaption</span><input id="line-subCaption-input" type='txt' onChange={this.setConfig}></input>
                                </div>
                                <div className="input-box">
                                    <span>X axis name</span><input id="line-xAxisName-input" type='txt' onChange={this.setConfig}></input>
                                </div>
                                <div className="input-box">
                                    <span>Y axis name</span><input id="line-yAxisName-input" type='txt' onChange={this.setConfig}></input>
                                </div>
                                <div className="input-chk-box">
                                    <label htmlFor="line-average-input">Show average</label><input id="line-average-input" type='checkbox' onChange={this.setConfig}></input>
                                </div>
                            </div>
                            <div className="config-buttons">
                                <button className="display-btn" disabled={filename === null? true: false} id="line-display-btn" onClick={this.displayMap}>Display</button>                        
                                <button disabled={filename === null? true: false } className="store-btn" id="line-store-btn" onClick={() => this.togglePdfSizeSettingPopupFlag(true)}>Store</button>
                                <button disabled={filename === null? true: false } className="download-btn" id="bar-download-btn" onClick={this.downloadPDF}>Download</button>
                            </div>
                        </div>
                    </div>
                    <div className="config-n-chart-container" id="cncc-pie" style={pieConStyle}>
                        <div className="chart" id="pie-react-fc"><div style={pieChStyle} ><ReactFC {...this.state.configForms.pie}/></div></div>

                        <div className="config-box" id="pie-config-sector">
                            <div className="config-guide">
                                <div className="guide-text">Please set the configuration</div>     
                                <div className="note">
                                    <div className="note-title">[NOTE]</div>
                                    <div className='note-content'>
                                        - <b>Sets of a label and a value</b> should be entered.<br/>
                                        - Values should be <u>numeric value</u>.<br/>
                                        - You can set if the percentage of each label's proportion'll be visible or not.
                                    </div>
                                </div>
                            </div>    

                            <div className="required-config"> 
                                <div className="required-title">Required</div>
                                <div id="pie-config-inputs">
                                    <div className="input-box">
                                        <span>Label</span><input id="pie-label-input" type='txt' onChange={this.setConfig}></input>
                                     </div>
                                    <div className="input-box">
                                        <span>Value</span><input id="pie-value-input" type='number' onChange={this.setConfig}></input>
                                    </div>
                                    <button id="pie-add-btn" onClick={this.addPieSet}>ADD</button>
                                </div>
                                <div id="pie-config-list">
                                    {configuedSets}
                                </div>

                            </div>

                            <div className="optional-config">
                                <div className="optional-title">Optional</div>
                                <div className="input-box">
                                    <span>Caption</span><input id="pie-caption-input" type='txt' onChange={this.setConfig}></input>
                                </div>
                                <div className="input-box">
                                    <span>Subcaption</span><input id="pie-subCaption-input" type='txt' onChange={this.setConfig}></input>
                                </div>
                                <div className="input-box">
                                <span>Value's number suffix</span><input id="pie-numberSuffix-input" type='txt' onChange={this.setConfig}></input>
                            </div>
                                <div className="input-box">
                                    <label htmlFor="pie-percentage-input">Show percentage</label><input id="pie-percentage-input" type='checkbox' onChange={this.setConfig}></input>
                                </div>
                            </div>
                            <div className="config-buttons">
                                <button id="pie-display-btn" disabled={this.state.config.pie.LnVSets.length > 1 ? false: true} onClick={this.displayMap}>Display</button>
                                <button className="store-btn" disabled={this.state.configForms.pie !== null ? false: true} id="pie-store-btn" onClick={() => this.togglePdfSizeSettingPopupFlag(true)}>Store</button>
                                <button className="download-btn"  disabled={this.state.configForms.pie !== null ? false: true} id="bar-download-btn" onClick={this.downloadPDF}>Download</button>
                            </div>
                        </div>
                    </div>

                    <div className="config-n-chart-container" id="cncc-map">
                        <div className="chart" id="pie-react-fc"><div style={mapChStyle} ><ReactFC {...this.state.configForms.map}/></div></div>
                        <div id="config-map">
                            <div className="selector" id="config-map-selector" onClick={this.setSelection}>MAP</div>
                            <div className="config-guide">
                                <div className="guide-text">Please set the configuration</div>     
                                <div className="note">
                                    <div className="note-title">[NOTE]</div>
                                    <div className='note-content'>
                                        - Each data object should have the key of which value is <br/>
                                            a <b>*2-letter country code</b> supplied by ISO. (ex. USA's ISO code is 'US')<br/>
                                        - Choose another key of data to sum by country. 
                                    </div>
                                </div>
                            </div>

                            <div className="required-config"> 
                                <div className="required-title">Required</div>
                                <div id="map-config-inputs">
                                    <div className="select-box"><span>Country code</span><select id="map-countryCode-select" onChange={this.setConfig}></select></div>
                                    <div className="select-box"><span>Key of the data to sum</span><select id="map-key-select" onChange={this.setConfig}></select></div>
                                </div>
                            </div>

                            <div className="optional-config">
                                <div className="optional-title">Optional</div>
                                <div className="input-box">
                                    <span>Caption</span><input id="pie-caption-input" type='txt' onChange={this.setConfig}></input>
                                </div>
                                <div className="input-box">
                                    <span>Subcaption</span><input id="pie-subCaption-input" type='txt' onChange={this.setConfig}></input>
                                </div>
                                <div className="input-box">
                                <span>Value's number suffix</span><input id="pie-numberSuffix-input" type='txt' onChange={this.setConfig}></input>
                            </div>
                                <div className="input-chk-box">
                                    <label htmlFor="pie-percentage-input">Show the percentage</label><input id="pie-percentage-input" type='checkbox' onChange={this.setConfig}></input>
                                </div>
                            </div>
                            <button id="map-display-btn" onClick={this.displayMap}>Display</button>
                        </div>
                    </div>
                </div>
                <div id="stored-charts">
                    <div id="stored-charts-title">Stored charts</div>
                    <div id="stored-charts-box">{storedCharts}</div>
                </div>
                <button disabled={this.props.pdfInfos.length === 0 ? true: false} id="send-email-btn" onClick={() => this.props.history.push('/sendEmail')}>Send the stored charts to your email.</button>
                
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    pdfInfos: state.pdfInfos
})

const mapDispatchToProps = (dispatch) => ({
    addPdfInfo: (id, chartname, gType, blob) => dispatch(addPdfInfo(id, chartname, gType, blob))
})

export default connect( mapStateToProps, mapDispatchToProps)(ChartPage);