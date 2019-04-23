import React from 'react';
import './MainPage.css';
import Sektor from '../Utils/sektor';


// <rect id="bar-1" className="bar" width="30" height="20" id="bar-1" />
// <rect id="bar-2" className="bar" width="30" height="60" id="bar-2" />
// <rect id="bar-3" className="bar" width="30" height="160" id="bar-3" />
class MainPage extends React.Component{
    


    componentDidMount(){
        var sektor = new Sektor('#circle-chart', {
            angle: 0,
            size: 160,
			sectorColor: 'url(#gradient)',
			circleColor: '#73676785'
          });
        
            sektor.animateTo(130, 1000)    

    }

    
    
    
    render(){


        return(
            <div>
                <div id="app-name">My Chart</div>
                <div id="charts-background">
                <div id="charts">
                    <div id="bar-chart">
                        <svg width="180" height="172">
                            <defs>
                                <linearGradient id="gradient">
                                    <stop className="main-stop" offset="0%" />
                                    <stop className="alt-stop" offset="100%" />
                                </linearGradient>
                            </defs>
                            <path className="x-y-line" d="M 0 0 L 0 170 L 170 170"></path>
                            <rect id="bar-1" className="bar" width="30" height="20" id="bar-1" />
                            <rect id="bar-2" className="bar" width="30" height="60" id="bar-2" />
                            <rect id="bar-3" className="bar" width="30" height="160" id="bar-3" />
                        </svg>
                    </div>
                    <div id="circle-chart"></div>
                    <div id="line-chart">
                        <svg width="180" height="172"> 
                            <path className="x-y-line" d="M 0 0 L 0 170 L 170 170"></path>
                            <path id="line" d="M -4 180 L 50 100 L 80 120 L 110 60 L 130 100 L 170 30"></path>
                        </svg>
                    </div>
                </div>
                </div>
                <div id="start-btn" onClick={() => this.props.history.push('/chart')}>Get Started</div>
            </div>
        )
    }    
}

export default MainPage;