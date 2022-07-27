import React from 'react'
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native'
import styles from '../../../style'

export default class Password extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      current: '',
      new: '',
      conf: '',
      accessToken: localStorage.getItem('token')
    }
    this.changePassword = this.changePassword.bind(this)
  }

  changePassword () {
    if (this.state.new == this.state.conf) {
      if (this.state.new < 8 || this.state.new > 25 || this.state.conf < 8 || this.state.conf > 25) {
        this.setState({ loading: true })
        const requestOptions = {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + this.state.accessToken,
            'Content-Type': 'application/json',
            Accept: '*/*'
          },
          mode: 'cors',
          body: JSON.stringify({
            password: this.state.current,
            new: this.state.new
          })
        }
        fetch(this.props.url + 'password', requestOptions)
          .then(response => response.json())
          .then(data => {
            this.setState({ loading: false })
            if (data.success === true) {
              alert(this.props.lang == 'en' ? 'Successfully changed password.' : 'Επιτυχής αλλαγή κωδικού.')
            } else if (data.error === 'password_error') {
              alert(this.props.lang == 'en' ? 'Invalid password.' : 'Λάθος κωδικός.')
            }
          })
          .catch(e => alert(e))
      } else {
        alert(this.props.lang == 'en' ? 'Password must be at least 8 characters and at most 25' : 'Ο κωδικός πρέπει να αποτελείται από τουλάχιστον 8 χαρακτήρες και το πολύ 25.')
      }
    } else {
      alert(this.props.lang == 'en' ? 'Passwords don"t match!' : 'Οι κωδικοί δεν ταιριάζουν!')
    }
  }

  render () {
    return (
      <View style={styles.optionContainer}>
        <TextInput
          secureTextEntry
          style={styles.optionInput}
          placeholder={this.props.lang == 'en' ? 'Current Password' : 'Τωρινός κωδικός'}
          value={this.state.current}
          onChangeText={input => this.setState({ current: input })}
        />
        <TextInput
          secureTextEntry
          style={styles.optionInput}
          placeholder={this.props.lang == 'en' ? 'New Password' : 'Νέος κωδικός'}
          value={this.state.username}
          onChangeText={input => this.setState({ new: input })}
        />
        <TextInput
          secureTextEntry
          style={styles.optionInput}
          placeholder={this.props.lang == 'en' ? 'Confirm Password' : 'Επαλήθευση κωδικού'}
          value={this.state.username}
          onChangeText={input => this.setState({ conf: input })}
        />
        <Pressable style={styles.optionPressable} onPress={() => { this.changePassword() }}>
          <Text style={styles.optionPressableText}>{this.props.lang === 'en' ? 'Change' : 'Αλλαγή'}</Text>
          {this.state.loading && <ActivityIndicator style={styles.menuLoading} color='grey' />}
        </Pressable>
      </View>
    )
  }
}
