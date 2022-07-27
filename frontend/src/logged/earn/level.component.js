import React from 'react'
import { View, Text, Pressable, Image } from 'react-native'
import styles from '../../../style'

export default class Level extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let join
    if (this.props.level > this.props.userData.level) {
      join = (
        <View style={styles.levelRight}>
          <Text style={styles.levelRight}>{this.props.buy}</Text>
          <Pressable style={styles.levelPressable}>
            <Text>{this.props.lang === 'en' ? 'Join' : 'Συμμετοχή'}</Text>
          </Pressable>
        </View>
      )
    } else {
      join = null
    }
    return (
      <View style={styles.level}>
        <View style={styles.levelIconAndText}>
          <Image style={styles.levelIcon} source={require('../../../assets/levels/' + this.props.level + '.png')} />
          <View style={styles.levelTextContainer}>
            <Text>{this.props.lang === 'en' ? 'Level' : 'Επίπεδο'} {this.props.level}</Text>
            <Text style={styles.levelTextSmall}>{this.props.lang === 'en' ? 'Price' : 'Αξία'}: {this.props.value}</Text>
            <Text style={styles.levelTextSmall}>{this.props.lang === 'en' ? 'Daily task' : 'Ημερήσιες εργασίες'}: {this.props.daily}</Text>
          </View>
        </View>
        {join}
      </View>
    )
  }
}
