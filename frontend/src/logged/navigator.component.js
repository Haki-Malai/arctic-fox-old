import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import styles from '../../style';

export default class Navigator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            style: {
                home: styles.navPressable,
                earn: styles.navPressableFaded,
                vip: styles.navPressableFaded,
                task: styles.navPressableFaded,
                account: styles.navPressableFaded,
            },
            pages: ['home', 'earn', 'task', 'account'],
            pageLabels: [['Home', 'Βάση'], ['Earn', 'Απέκτησε'], ['Task', 'Εργασία'], ['Account', 'Λογαριασμός']]
        }
    }

    componentDidMount() {
        if (this.props.page === 'home') {
            this.setState({
                style: {
                    home: styles.navPressable,
                    earn: styles.navPressableFaded,
                    vip: styles.navPressableFaded,
                    task: styles.navPressableFaded,
                    account: styles.navPressableFaded,
                }
            });
        } else if (this.props.page === 'earn') {
            this.setState({
                style: {
                    home: styles.navPressableFaded,
                    earn: styles.navPressable,
                    vip: styles.navPressableFaded,
                    task: styles.navPressableFaded,
                    account: styles.navPressableFaded,
                }
            });
        } else if (this.props.page === 'vip') {
            this.setState({
                style: {
                    home: styles.navPressableFaded,
                    earn: styles.navPressableFaded,
                    vip: styles.navPressable,
                    task: styles.navPressableFaded,
                    account: styles.navPressableFaded,
                }
            });
        } else if (this.props.page === 'task') {
            this.setState({
                style: {
                    home: styles.navPressableFaded,
                    earn: styles.navPressableFaded,
                    vip: styles.navPressableFaded,
                    task: styles.navPressable,
                    account: styles.navPressableFaded,
                }
            });
        } else if (this.props.page === 'account') {
            this.setState({
                style: {
                    home: styles.navPressableFaded,
                    earn: styles.navPressableFaded,
                    vip: styles.navPressableFaded,
                    task: styles.navPressableFaded,
                    account: styles.navPressable,
                }
            });
        }
    }

    render() {
        var buttons = [];
        for (let i=0; i<this.state.pages.length; i++) {
            buttons.push(
                <Pressable key={i} style={this.state.style.home} onPress={() => this.props.setPage(this.state.pages[i])} >
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