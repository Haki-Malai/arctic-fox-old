import React from 'react'
import { View, Text, Image } from 'react-native'
import Navigator from './navigator.component'
import Media from './home/media.component'
import styles from '../../style'

export default class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      accessToken: localStorage.getItem('token'),
      feed: [],
      getFeedTimeout: null
    }
    this.setMedia = this.setMedia.bind(this)
  }

  setMedia () {
    this.props.setPage('earn')
  }

  getFeedData () {
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.state.accessToken,
        Accept: '*/*'
      },
      mode: 'cors'
    }

    fetch(this.props.url + 'feed', requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.feed) {
          this.setState({ feed: data.feed })
        }
      })

    // Refresh feed every 30 seconds and clears on unmount
    this.setState({
      getFeedTimeout: setTimeout(() => { this.getFeedData() }, 30000)
    })
  }

  componentDidMount () {
    this.getFeedData()
    this.props.refreshUserData()
  }

  componentWillUnmount () {
    clearTimeout(this.state.getFeedTimeout)
  }

  render () {
    const feed = []
    for (let i = 0; i < this.state.feed.length; i++) {
      feed.push(
        <View key={i} style={styles.feed}>
          <Image style={styles.feedPic} source={this.props.avatar} />
          <Text>User {this.state.feed[i][0]} just upgraded to level {this.state.feed[i][1]}!</Text>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <View style={styles.homeMedia}>
          <Text style={styles.homeMediaText}>Task list</Text>
          <Media setMedia={this.setMedia} enabled style={[styles.media, styles.mediaB]} title='Bounties' />
          <Text style={styles.homeMediaText}>User feed</Text>
          {feed}
        </View>
        <Navigator lang={this.props.lang} setPage={this.props.setPage} page={0} />
      </View>
    )
  }
}
