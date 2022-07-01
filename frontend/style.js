import { StyleSheet, Dimensions } from 'react-native';

// Set's width and height of the component
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;
let PressableWidth = ScreenWidth
if (ScreenHeight < ScreenWidth) {
        PressableWidth = ScreenWidth/2
        ScreenWidth = ScreenWidth/2
}

const BLACK = '242526';
const BLUE = 'royalblue';
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
        backgroundColor: WHITE,
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
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~WELCOME~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~LOGIN~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~MENU~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    menuPressable: {
        fontWeight: 'bold',
        backgroundColor: BLUE,
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
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~NAVIGATOR~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	navigator: {
		flex: 1,
		flexDirection: 'row',
		zIndex: 1,
		position: 'fixed',
		bottom: 0,
		justifyContent: 'center',
		width: ScreenWidth,
		minHeight: navHeight,
		backgroundColor: BLUE
	},
	navPressable: {
		zIndex: 2,
		alignItems: 'center',
		maxWidth: navIconDimensions,
		height: navIconDimensions,
		marginHorizontal: navIconDimensions*1.4,
		marginVertical: navIconDimensions/2,
	},
	navPressableFaded: {
		zIndex: 2,
		alignItems: 'center',
		maxWidth: navIconDimensions,
		height: navIconDimensions,
		marginHorizontal: navIconDimensions*1.4,
		marginVertical: navIconDimensions/2,
		opacity: 0.5
	},
	navPressableIcon: {
		minWidth: navIconDimensions,
		minHeight: navIconDimensions
	},
	navPressableText: {
		fontSize: navIconDimensions/2.5,
		fontWeight: 'bold'
	},
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~MEDIA~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	media: {
		flexDirection: 'row',
		width: ScreenWidth/1.1,
		padding: '.4em',
		marginVertical: '.4em',
		borderRadius: '.4em',
	},
	mediaIcon: {
		height: '2em',
		width: '2em',
		tintColor: 'white'
	},
	mediaTitle: {
		marginTop: '.5em',
		marginLeft: '.5em',
		color: 'white',
		fondWeight: 'bold'
	},
	mediaF: {
		backgroundColor: '#3b5998',
	},
	mediaI: {
		backgroundColor: '#bc2a8d',
	},
	mediaY: {
		backgroundColor: '#c4302b',
	},
	mediaDisabled: {
		backgroundColor: 'grey'
	},
	mediaReceive: {
		marginTop: '.4em',
		left: '22%',
		textAlign: 'center'
	},
	mediaReceiveText: {
		backgroundColor: BLUE,
		padding: '.1em',
		borderRadius: '.5em',
		color: 'white',
		fontSize: '.8em'
	},
	homeMedia: {
		textAlign: 'center',
	},
	homeMediaText: {
		borderBottomWidth: '.1em',
		borderColor: BLUE
	},
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FEED~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	feed: {
		flexGrow: 'column',
		flexDirection: 'row',
		padding: '.2em',
		maxWidth: ScreenWidth/1.3,
		alignItems: 'center',
		borderBottomColor: 'grey',
		borderBottomWidth: '.1em'
	},
	feedPic: {
		borderRadius: '10em',
		width: '3em',
		height: '3em',
		marginHorizontal: '1em',
		marginVertical: '.5em',
	},
});
