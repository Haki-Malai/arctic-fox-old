import React from 'react'
import * as Font from 'expo-font'
import { View } from 'react-native'
import Welcome from './src/notLogged/welcome.component'
import Login from './src/notLogged/login.component'
import Signup from './src/notLogged/signup.component'
import Home from './src/logged/home.component'
import Account from './src/logged/account.component'
import Earn from './src/logged/earn.component'
import Task from './src/logged/task.component'
import styles from './style'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      url: 'http://localhost:8010/proxy/',
      lang: 'en',
      fontsLoaded: false,
      page: 'welcome',
      accessToken: localStorage.getItem('token'),
      userData: {},
      avatar: '',
      remember: false,
      data: require('./data.json'),
      level: [[5, 3, 0], [8, 5, 100], [15, 8, 200], [17, 15, 300], [20, 22, 400], [23, 60, 500]]
    }
    this.setPage = this.setPage.bind(this)
    this.setLang = this.setLang.bind(this)
    this.refreshUserData = this.refreshUserData.bind(this)
  }

  setLang (lang) {
    this.setState({ lang })
  }

  setPage (page) {
    this.setState({ page })
  }

  getAuthorized () {
    // Authorization from saved cookie
    if (this.state.accessToken) {
      const requestOptions = {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + this.state.accessToken,
          'Content-Type': 'application/json',
          Accept: '*/*'
        },
        mode: 'cors'
      }

      fetch(this.state.url + 'user', requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.setState({ userData: JSON.parse(data.userData) })
            this.setState({ avatar: 'data:image/jpg;base64,' + data.avatar })
            this.setState({ page: 'home' })
          } else {
            this.setState({ page: 'welcome' })
          }
        })
    }
  }

  refreshUserData () {
    this._isMounted = true
    // Authorization from saved cookie
    if (this.state.accessToken) {
      const requestOptions = {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + this.state.accessToken,
          'Content-Type': 'application/json',
          Accept: '*/*'
        },
        mode: 'cors'
      }

      fetch(this.state.url + 'user', requestOptions)
        .then(response => response.json())
        .then(data => {
          if (this._isMounted) {
            if (data) {
              this.setState({ userData: JSON.parse(data.userData) })
              this.setState({ avatar: 'data:image/jpg;base64,' + data.avatar })
            } else {
              this.setState({ page: 'welcome' })
            }
          }
        })
    }
  }

  async loadFonts () {
    await Font.loadAsync({
      Roboto: require('./assets/fonts/Roboto-Regular.ttf'),

      'Roboto-Bold': {
        uri: require('./assets/fonts/Roboto-Bold.ttf'),
        display: Font.FontDisplay.FALLBACK
      }
    })
    this.setState({ fontsLoaded: true })
  }

  componentDidMount () {
    document.title = 'Arctic Fox'
    this.loadFonts()
    this.getAuthorized()
    this.refreshUserData()
  }

  componentWillUnmount () {
  		this._isMounted = false
  	}

  render () {
    // Warn user if font didn"t load
    if (!this.state.fontsLoaded) console.warn('Error, unable to load fonts')

    let toRender

    if (this.state.page === 'welcome') {
      toRender = (
        <Welcome
          setLang={this.setLang}
          lang={this.state.lang}
          setPage={this.setPage}
          refreshUserData={this.refreshUserData}
          userData={this.state.userData}
        />
      )
    } else if (this.state.page === 'login') {
      toRender = (
        <Login
          url={this.state.url}
          setLang={this.setLang}
          lang={this.state.lang}
          setPage={this.setPage}
          refreshUserData={this.refreshUserData}
          userData={this.state.userData}
        />
      )
    } else if (this.state.page === 'signup') {
      toRender = (
        <Signup
          url={this.state.url}
          setLang={this.setLang}
          lang={this.state.lang}
          setPage={this.setPage}
          refreshUserData={this.refreshUserData}
          userData={this.state.userData}
        />
      )
    } else if (this.state.page === 'home') {
      toRender = (
        <Home
          url={this.state.url}
          setLang={this.setLang}
          lang={this.state.lang}
          setPage={this.setPage}
          refreshUserData={this.refreshUserData}
          userData={this.state.userData}
          avatar={this.state.avatar}
        />
      )
    } else if (this.state.page === 'earn') {
      toRender = (
        <Earn
          url={this.state.url}
          setLang={this.setLang}
          lang={this.state.lang}
          setPage={this.setPage}
          refreshUserData={this.refreshUserData}
          userData={this.state.userData}
          level={this.state.level}
          owaspList={this.state.data.owaspList}
          avatar={this.state.avatar}
        />
      )
    } else if (this.state.page === 'task') {
      toRender = (
        <Task
          url={this.state.url}
          setLang={this.setLang}
          lang={this.state.lang}
          setPage={this.setPage}
          refreshUserData={this.refreshUserData}
          userData={this.state.userData}
          level={this.state.level}
          owaspList={this.state.data.owaspList}
          avatar={this.state.avatar}
        />
      )
    } else if (this.state.page === 'account') {
      toRender = (
        <Account
          url={this.state.url}
          setLang={this.setLang}
          lang={this.state.lang}
          setPage={this.setPage}
          refreshUserData={this.refreshUserData}
          userData={this.state.userData}
          level={this.state.level}
          avatar={this.state.avatar}
        />
      )
    }
    return (
      <View style={styles.container}>
        {toRender}
      </View>
    )
  }
}
