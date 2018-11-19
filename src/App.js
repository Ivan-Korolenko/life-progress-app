import React, { Component } from 'react'
import './App.css'

class App extends Component {

  state = {
    age: undefined,
    lifeExpectancy: undefined
  }

  onLifeDataChange = lifeData => {
    if (lifeData.age && lifeData.lifeExpectancy)
      this.setState({ lifeExpectancy: lifeData.lifeExpectancy, age: lifeData.age })
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
        Day: {hoursPercentage}%
        <br/>
        Month: {daysInMonthPercentage}%
        <br/>
        Year: {daysInYearPercentage}%
        <br/>
        Life: {daysInLifePercentage ? `${daysInLifePercentage}%` : "Please enter your age and life expectancy"}
        <LifeExpectancyInputs onLifeDataChange={this.onLifeDataChange} /> 
      </div>
    )
  }
}


class LifeExpectancyInputs extends Component {

  state = {
    error: false,
    ageValue: '',
    lifeExpectancyValue: ''
  }

  onAgeInputChange = e => {
    const inputValue = e.target.value

    if(inputValue) this.setState({ ageValue: inputValue })
  }

  onLifeExpectancyInputChange = e => {
    const inputValue = e.target.value

    if(inputValue) this.setState({ lifeExpectancyValue: inputValue })
  }

  onButtonClick = () => {
    if (this.state.ageValue && this.state.lifeExpectancyValue) 
      this.props.onLifeDataChange({
        age: this.state.ageValue, 
        lifeExpectancy: this.state.lifeExpectancyValue
      })
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
    const {error} = this.state
    return (
      <div className="life-expectancy-input">
        <label>Your age and life expectancy: </label>
        <input type="text" onChange={this.onAgeInputChange} onKeyPress={this.validate}/>
        <input type="text" onChange={this.onLifeExpectancyInputChange} onKeyPress={this.validate}/>
        <button onClick={this.onButtonClick}>OK</button>
        {error && "Please enter a number"}
      </div>
    )
  }
}

export default App
