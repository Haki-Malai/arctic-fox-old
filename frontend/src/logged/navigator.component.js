import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import styles from '../../style';

export default class Navigator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: ['home', 'earn', 'task', 'account'],
            pageLabels: [['Home', 'Βάση'], ['Earn', 'Απέκτησε'], ['Task', 'Εργασία'], ['Account', 'Λογαριασμός']]
        }
    }

    render() {
        var buttons = [];
        for (let i=0; i<this.state.pages.length; i++) {
            buttons.push(
                <Pressable key={i} style={ this.props.page===i? styles.navPressable: styles.navPressableFaded } onPress={() => this.props.setPage(this.state.pages[i])} >
					<Image style={styles.navPressableIcon} source={require('../../assets/navigator/'+this.state.pages[i]+'.png')}/>
                    <Text style={styles.navPressableText}>{this.props.lang=='en'? this.state.pageLabels[i][0]: this.state.pageLabels[i][1]}</Text>
				</Pressable>
            )
        }
        return(
            <View style={styles.navigator}>
                {buttons}
            </View>
        );
    }
}