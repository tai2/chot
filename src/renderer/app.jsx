import React from 'react'
import screenshot from 'screenshot-desktop'
import takeScreenshot from './screenshot'

const { app, dialog, globalShortcut } = require('electron').remote

localStorage.storeDir = localStorage.storeDir || app.getPath('desktop')

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      storeDir: localStorage.storeDir,
      displays: [],
      selectedDisplay: 0,
      startNumber: 1,
    }
  }
  componentDidMount() {
    screenshot.listDisplays().then((displays) => {
      this.setState({ displays })
    })
    globalShortcut.register('CommandOrControl+Shift+Alt+3', () => {
      this.takeScreenshot()
    })
  }
  componentWillUnmount() {
    globalShortcut.unregister('CommandOrControl+Shift+Alt+3')
  }
  takeScreenshot = () => {
    takeScreenshot(this.state.storeDir, this.state.selectedDisplay, this.state.startNumber)
  }
  handleStartNumberChange = (ev) => {
    this.setState({ startNumber: parseInt(ev.target.value, 10) })
  }
  handleDisplayChange = (ev) => {
    this.setState({ selectedDisplay: parseInt(ev.target.value, 10) })
  }
  handlePickerButtonClick = () => {
    dialog.showOpenDialog({
      defaultPath: this.state.storeDir,
      properties: ['openDirectory'],
    }, (filePaths) => {
      const storeDir = filePaths[0]
      this.setState({ storeDir })
      localStorage.storeDir = storeDir
    })
  }
  render() {
    return (
      <div className="app">
        <div className="app__start-number-row">
          <label htmlFor="start-number-input">Start number:</label>
          <input id="start-number-input" type="number" value={this.state.startNumber} onChange={this.handleStartNumberChange} />
        </div>
        <div className="app__display-select-row">
          <label htmlFor="display-select">Display:</label>
          <select id="display-select" value={this.state.selectedDisplay} onChange={this.handleDisplayChange}>
            {this.state.displays.map(display => (
              <option key={display.id} value={display.id}>{display.name}</option>
            ))}
          </select>
        </div>
        <div className="app__dir-picker-row">
          <label htmlFor="dir-picker-button">Save in:</label>
          <label htmlFor="dir-picker-button">{this.state.storeDir}</label>
          <button id="dir-picker-button" onClick={this.handlePickerButtonClick}>Select</button>
        </div>
        <button className="app__ss-button" onClick={this.takeScreenshot}>Take a screenshot</button>
      </div>
    )
  }
}

