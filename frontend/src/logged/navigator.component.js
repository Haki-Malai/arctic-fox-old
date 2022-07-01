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
        return(
            <View style={styles.navigator}>
                <Pressable style={this.state.style.home} onPress={() => this.props.setPage('home')} >
					<Image style={styles.navPressableIcon} source={require('../../assets/navigator/home.png')}/>
                    <Text style={styles.navPressableText}>{this.props.lang=='en'? 'Home': 'Βάση'}</Text>
				</Pressable>
            </View>
        );
    }
}