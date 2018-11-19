import React, { Component } from 'react'
import './App.css'

class App extends Component {

  state = {
    age: undefined,
    lifeExpectancy: undefined,
    time: undefined
  }

  componentDidMount = () => {
    const memorizedLifeData = JSON.parse(localStorage.getItem("lifeData"))
    if(memorizedLifeData) this.setState({...memorizedLifeData})
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 60000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  onLifeDataChange = lifeData => {
    if (lifeData && lifeData.age && lifeData.lifeExpectancy) {
      this.setState({...lifeData})
      localStorage.setItem("lifeData", JSON.stringify(lifeData))
    }
  }

  getDaysInMonth = (month, year) => 
    new Date((new Date()).getFullYear(), (new Date()).getMonth()+1, 0).getDate()

  getDayNumberInYear = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000)
    const oneDay = 1000 * 60 * 60 * 24
    return Math.floor(diff / oneDay)
  }

  isLeapYear = year => year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)

  getDaysInYear = year => this.isLeapYear(year) ? 366 : 365

  render() {
    const {age, lifeExpectancy} = this.state
    const date = new Date
    const hoursPercentage = Math.floor( (date.getHours() / 24) * 100 )
    const daysInMonthPercentage = Math.floor( (date.getDate() / this.getDaysInMonth(date.getMonth(), date.getFullYear())) * 100)
    const daysInYearPercentage = Math.floor( (this.getDayNumberInYear() / this.getDaysInYear(date.getFullYear())) * 100 )
    const daysInLifePercentage = lifeExpectancy ? Math.floor((age / lifeExpectancy) * 100) : null

    return (
      <div className="App">
        <div className="logo"><img src="favicon.png" alt="logo"/></div>
        <h1>Life Progress App</h1>
        <div className="content">
          <div className="percantage-block">
            <div className="percantage-block-label">Day: </div>
            <div className="percentage-bar">
              <div className="percentage-bar-filled-part" style={{width: `${hoursPercentage}%`}}>
                {hoursPercentage}%
              </div>
            </div>
          </div>
          <div className="percantage-block">
            <div className="percantage-block-label">Month: </div>
            <div className="percentage-bar">
              <div className="percentage-bar-filled-part" style={{width: `${daysInMonthPercentage}%`}}>
                {daysInMonthPercentage}%
              </div>
            </div>
          </div>
          <div className="percantage-block">
            <div className="percantage-block-label">Year: </div>
            <div className="percentage-bar">
              <div className="percentage-bar-filled-part" style={{width: `${daysInYearPercentage}%`}}>
                {daysInYearPercentage}%
              </div>
            </div>
          </div>
          <div className="percantage-block">
            <div className="percantage-block-label">Life: </div>
            {
              daysInLifePercentage 
              ? <div className="percentage-bar">
                  <div className="percentage-bar-filled-part" style={{width: `${daysInLifePercentage}%`}}>
                    {daysInLifePercentage}%
                  </div>
                </div>
              : "Please enter your age and life expectancy"
            }
          </div>
          <LifeExpectancyInputs 
            age={age || ''} 
            lifeExpectancy={lifeExpectancy || ''} 
            onLifeDataChange={this.onLifeDataChange} 
          />
        </div>
      </div>
    )
  }
}


class LifeExpectancyInputs extends Component {

  state = {
    error: '',
    age: '',
    lifeExpectancy: ''
  }
  componentDidUpdate = (prevProps, prevState) => {
    const {age, lifeExpectancy} = this.props
    if (prevProps.age !== this.props.age || prevProps.lifeExpectancy !== this.props.lifeExpectancy) {
      this.setState({age: age,  lifeExpectancy: lifeExpectancy })
    } 
  }

  onAgeInputChange = e => this.setState({ age: e.target.value })

  onLifeExpectancyInputChange = e => this.setState({ lifeExpectancy: e.target.value })

  onButtonClick = () => {
    const {age, lifeExpectancy} = this.state

    if (age && lifeExpectancy) {
      if(parseInt(age) <= parseInt(lifeExpectancy)) {
        this.setState({error: ""})
        this.props.onLifeDataChange({
          age: age, 
          lifeExpectancy: lifeExpectancy,
        })
      }
      else this.setState({error: "Age can't be bigger than life expectancy"})
    }
    else this.setState({error: "One or more of the fields is empty"})
  }

  validate = e => {
    const theEvent = e || window.event
    let key = null
  
    // Handle paste
    if (theEvent.type === 'paste') {
        key = theEvent.clipboardData.getData('text/plain')
    } else {
        // Handle key press
        key = String.fromCharCode(theEvent.keyCode || theEvent.which)
    }
    const regex = /[0-9]|\./
    if( !regex.test(key) ) {
      theEvent.returnValue = false
      if(theEvent.preventDefault) theEvent.preventDefault()
    }
  }

  render() {
    const {error, age, lifeExpectancy} = this.state
    return (
      <div className="life-expectancy-inputs">
        <label>Your age and life expectancy: </label>
        <input type="text" value={age} onChange={this.onAgeInputChange} onKeyPress={this.validate}/>
        <input type="text" value={lifeExpectancy} onChange={this.onLifeExpectancyInputChange} onKeyPress={this.validate}/>
        <button onClick={this.onButtonClick}>OK</button>
        {error ? <div className="error">{error}</div> : ''}
      </div>
    )
  }
}

export default App
