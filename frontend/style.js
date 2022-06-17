import { StyleSheet, Dimensions } from 'react-native';

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;
let PressableWidth = ScreenWidth
if (ScreenHeight < ScreenWidth) {
        PressableWidth = ScreenWidth/2
        ScreenWidth = ScreenWidth/2
}
const BLACK = '242526';
const BLUE = '2CA9C6';
const WHITE = '#F0FFF0';
const navHeight = ScreenHeight/20;
const navIconDimensions = ScreenWidth/20;
const logoDimensions = ScreenHeight/5

export default StyleSheet.create({
    menuContainer: {
        marginTop: '1em',
    },
    container: {
        fontFamily: 'Roboto',
        flex: 1,
        flexDirection: 'column',
        flexGrow: 'row',
        height: ScreenHeight,
        alignItems: 'center',
        backgroundColor: white,
        marginBottom: navIconDimensions
    },

    lang: {
        flexDirection: 'row',
    },

    langIcon: {
        margin: '1em',
        width: '2em',
        height: '2em'
    },

    text: {
        lineHeight: '1.5em',
        fontSize: '1.125rem',
        textAlign: 'center'
    },

    link: {
        fontSize: '1em',
        marginVertical: '.4em',
        color: '#1B95E0'
    },

    welcomeLogo: {
        minWidth: logoDimensions,
        minHeight: logoDimensions,
        resizeMode: 'contain'
    },
    
    welcomeTitle: {
        fontWeight: 'bold',
        fontSize: '2em',
        marginVertical: '.5em',
        textAlign: 'center'
    },

    loginCheckbox: {
        flexDirection: 'row'
    },

    loginCheckboxLabel: {
        marginLeft: '1em',
    },

    signupLogo: {
        minWidth: '4em',
        minHeight: '4em',
        resizeMode: 'contain'
    },

    signupTitle: {
        fontWeight: 'bold',
        fontSize: '.5rem',
        marginVertical: '.3em',
        textAlign: 'center'
    },

    menuPressable: {
        fontWeight: 'bold',
        backgroundColor: mainOrange,
        minWidth: PressableWidth,
        height: '4em',
        borderRadius: '1em',
        marginVertical: '.5em',
        justifyContent: 'center'
    },

    textPressable: {
        lineHeight: '1.5em',
        fontSize: '1.3rem',
        fontStyle: 'bold',
        textAlign: 'center',
        marginVertical: '1em'
    },

    menuInput: {
        textAlign: 'center',
        minWidth: ScreenWidth,
        borderRadius: '1em',
        marginVertical: '.5em',
        fontSize: '1.5em',
        paddingVertical: '.7em',
    },

    menuLoading: {
        position: 'absolute',
        left: '48%'
    },
});
