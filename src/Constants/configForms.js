const configForms = {
    bar: {
        type: 'column2d',// The chart type
        width: '700', // Width of the chart
        height: '473', // Height of the chart
        dataFormat: 'json', // Data type
        dataSource: {
            "chart": {
            "caption": null,
            "subCaption": null,
            "xAxisName": null,
            "yAxisName": null,
            "numberSuffix": null,
            "theme": "fusion",
            },
            "data": "here"
        }
    },
    line: {
        type: 'line',
        width: '700',
        height: '473',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "theme": "fusion",
                "caption": null,
                "subCaption": null,
                "xAxisName": null,
                "yAxisName": null,
                "lineThickness": "2"
            },
            "data": null,
            "trendlines": [{
                "line": [{
                    "color": "#29C3BE",
                    "displayvalue": "Average",
                    "valueOnRight": "1",
                    "thickness": "2"
                    }]
            }]
        }
    },
    pie: {
        type: 'pie2d',
        width: '700',
        height: '473',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "caption": null,
                "subCaption": null,
                "numberSuffix": null,
                "showPercentValues": "1",
                "decimals": "1",
                "useDataPlotColorForLabels": "1",
                "theme": "fusion"
            },
            "data": null
        }
    },        
    map: {
        type: "worldwithcountries",
        dataFormat: "json",
        dataSource: {
            "chart": {
                "caption": null,
                "subcaption": null,
                "entityFillHoverColor": "#cccccc",
                "numberScaleValue": "1,1000,1000",
                "numberScaleUnit": "K,M,B",
                "numberPrefix": null,
                "showLabels": "1",
                "theme": "fusion"
            }, 
            "data": null
        }
    }
}

export default configForms;



