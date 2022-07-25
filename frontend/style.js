import{ StyleSheet, Dimensions } from "react-native";

// Set"s width and height of the component
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
let PressableWidth = ScreenWidth;
if (ScreenHeight < ScreenWidth){
    PressableWidth = ScreenWidth/2
    ScreenWidth = ScreenWidth/2
}

const BLACK = "#242526";
const FADED_BLACK = "#565656";
const BLUE = "#445C6D";
const FADED_BLUE = "#879EB0";
const MORE_FADED_BLUE = "#8BB3B4";
const EVEN_MORE_FADED_BLUE = "#B0D2CF";
const SUPER_FADED_BLUE = "#CEE9EA";
const WHITE = SUPER_FADED_BLUE;
const navHeight = ScreenHeight / 20;
const navIconDimensions = ScreenWidth / 20;
const logoDimensions = ScreenHeight / 5;

export default StyleSheet.create({
    menuContainer:{
        marginTop: "1em",
    },
    container:{
        fontFamily: "Roboto",
        flex: 1,
        flexDirection: "column",
        flexGrow: "row",
        height: ScreenHeight,
        alignItems: "center",
        backgroundColor: WHITE,
        paddingBottom: navIconDimensions
    },

    lang:{
        flexDirection: "row",
    },

    langIcon:{
        margin: "1em",
        width: "2em",
        height: "2em"
    },

    text:{
        lineHeight: "1.5em",
        fontSize: "1.125rem",
        textAlign: "center"
    },

    link:{
        fontSize: "1em",
        marginVertical: ".4em",
        color: "#1B95E0"
    },
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~WELCOME~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    welcomeLogo:{
        minWidth: logoDimensions,
        minHeight: logoDimensions,
        resizeMode: "contain"
    },
    
    welcomeTitle:{
        fontWeight: "bold",
        fontSize: "2em",
        marginVertical: ".5em",
        textAlign: "center"
    },
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~LOGIN~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    loginCheckbox:{
        flexDirection: "row"
    },

    loginCheckboxLabel:{
        marginLeft: "1em",
    },

    signupLogo:{
        minWidth: "4em",
        minHeight: "4em",
        resizeMode: "contain"
    },

    signupTitle:{
        fontWeight: "bold",
        fontSize: ".5rem",
        marginVertical: ".3em",
        textAlign: "center"
    },
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~MENU~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    menuPressable:{
        fontWeight: "bold",
        backgroundColor: BLUE,
        minWidth: PressableWidth,
        height: "4em",
        borderRadius: "1em",
        marginVertical: ".5em",
        justifyContent: "center"
    },

    textPressable:{
        lineHeight: "1.5em",
        fontSize: "1.3rem",
        fontStyle: "bold",
        textAlign: "center",
        marginVertical: "1em"
    },

    menuInput:{
        textAlign: "center",
        minWidth: ScreenWidth,
        borderRadius: "1em",
        marginVertical: ".5em",
        fontSize: "1.5em",
        paddingVertical: ".7em",
    },

    menuLoading:{
        position: "absolute",
        left: "48%"
    },
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~NAVIGATOR~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    navigator:{
        flex: 1,
        flexDirection: "row",
        zIndex: 1,
        position: "fixed",
        bottom: 0,
        justifyContent: "center",
        width: ScreenWidth,
        minHeight: navHeight,
        backgroundColor: BLUE
    },
    navPressable:{
        zIndex: 2,
        alignItems: "center",
        maxWidth: navIconDimensions,
        height: navIconDimensions,
        marginHorizontal: navIconDimensions*1.4,
        marginVertical: navIconDimensions/2,
    },
    navPressableFaded:{
        zIndex: 2,
        alignItems: "center",
        maxWidth: navIconDimensions,
        height: navIconDimensions,
        marginHorizontal: navIconDimensions*1.4,
        marginVertical: navIconDimensions/2,
        opacity: 0.5
    },
    navPressableIcon:{
        minWidth: navIconDimensions,
        minHeight: navIconDimensions
    },
    navPressableText:{
        fontSize: navIconDimensions/2.5,
        fontWeight: "bold"
    },
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~MEDIA~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    media:{
        flexDirection: "row",
        width: ScreenWidth/1.1,
        padding: ".4em",
        marginVertical: ".4em",
        borderRadius: ".4em",
        alignItems: "center",
    },
    mediaIcon:{
        height: "2em",
        width: "2em",
        tintColor: WHITE,
        marginLeft: ".2em",
    },
    mediaTitle:{
        marginLeft: ".5em",
        color: WHITE,
        fontWeight: "bold",
        fontSize: "1em"
    },
    mediaNoData:{
        justifyContent: "center"
    },
    mediaA:{
        backgroundColor: FADED_BLACK,
    },
    mediaB:{
        backgroundColor: BLUE,
    },
    mediaDisabled:{
        backgroundColor: "grey"
    },
    mediaBack:{
        justifyContent: "center",
        backgroundColor: FADED_BLUE,
        color: BLACK,
        fontSize: "1.2em",
        cursor: "pointer"
    },
    homeMedia:{
        textAlign: "center",
    },
    homeMediaText:{
        borderBottomWidth: ".1em",
        borderColor: BLUE
    },
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FEED~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    feed:{
        flexGrow: "column",
        flexDirection: "row",
        padding: ".2em",
        maxWidth: ScreenWidth/1.3,
        alignItems: "center",
        borderBottomColor: "grey",
        borderBottomWidth: ".1em"
    },
    feedPic:{
        borderRadius: "10em",
        width: "3em",
        height: "3em",
        marginHorizontal: "1em",
        marginVertical: ".5em",
    },
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ACCOUNT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    accountScroll:{
        alignItems: "center",
        minHeight: ScreenHeight,
    },
    account:{
        backgroundColor: WHITE,
        alignItems: "center",
        paddingBottom: navIconDimensions*2,
    },
    accountDetailsWrapper:{
        backgroundColor: FADED_BLUE,
        borderBottomLeftRadius: "7em",
        borderBottomRightRadius: "7em",
        width: ScreenWidth,
        padding: "1em",
        alignItems: "center",
        fontSize: "1em"
    },
    avatarContainer:{
        alignSelf: "center",
    },
    avatar:{
        height: "10em",
        width: "10em",
        borderRadius: "100%",
        borderStyle: "solid",
        borderColor: BLUE,
        borderWidth: ".2em"
    },
    avatarHover:{
        height: "10em",
        width: "10em",
        borderRadius: "100%",
        borderStyle: "solid",
        borderColor: BLUE,
        borderWidth: ".2em",
        opacity: 0.7,
    },
    avatarUploadContainer:{
        position: "absolute",
        alignSelf: "center",
    },
    avatarUpload:{
        marginTop: "3em",
        color: WHITE,
        height: "4em",
        width: "4em",
        position: "absolute",
        alignSelf: "center",
    },
    accountUsername:{
        fontSize: "1.5em",
        fontWeight: "bold",
        margin: ".4em",
        textAlign: "center"
    },
    accountDetail:{
        fontSize: ".8em",
        fontWeight: "bold",
        padding: ".2em",
    },
    accountPressable:{
        backgroundColor: "black",
        borderRadius: "1em",
        color: BLUE,
        margin: ".4em",
        paddingVertical: ".1em",
        paddingHorizontal: ".4em"
    },
    accountTables:{
        shadowColor: "#000",
        shadowOpacity: 0.48,
        shadowRadius: 11.95,
        elevation: 18,
        marginTop: "1em",
        padding: "1em",
        backgroundColor: MORE_FADED_BLUE,
        borderRadius: "1em"
    },
    accountTable:{
        flexDirection: "row",
        margin: "1em",
        borderStyle: "solid",
        borderColor: "grey",
    },
    accountTableItem:{
        width: ScreenWidth/4,
        fontSize: "1.5em",
        textAlign: "center",
    },
    accountTableItemLabel:{
        display: "block",
        fontSize: "0.5em",
        color: "grey",
    },
    accountButtons:{
        flexDirection: "row",
        width: ScreenWidth
    },
    accountButton:{
        textAlign: "center",
        width: ScreenWidth/5,
        alignItems: "center",
        marginVertical: ".5em",
    },
    accountPressableIcon:{
        width: "3em",
        height: "3em",
    },
    accountPressableText:{
        fontSize: ".7em",
        textAlign: "center"
    },
    accountOption:{
        padding: ".3em",
        width: ScreenWidth/1.1,
        borderStyle: "solid",
        borderColor: "grey",
        borderBottomWidth: ".1em",
        marginBottom: ".4em",
        alignItems: "center"
    },
    accountOptionPressableText:{
        flexDirection: "row",
        fontSize: "1em"
    },
    accountOptionPressableIcon:{
        width: "1em",
        height: "1em",
        marginRight: "1em"
    },
    accountLogout:{
        fontSize: "1.3em",
        color: BLUE,
        marginVertical: ".5em",
        textAlign: "center",
        padding: "0.4em",
        borderStyle: "solid",
        borderColor: "grey",
        borderWidth: ".01em"
    },
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~OPTIONS-ACCOUNT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    optionContainer:{
        alignSelf: "center",
        alignItems: "center",
        maxWidth: ScreenWidth/1.2,
        textAlign: "center"
    },
    optionInput:{
        fontSize: "1.2em",
        textAlign: "center",
        borderBottomWidth: ".1em",
        borderBottomColor: "grey",
        marginVertical: ".4em"
    },
    optionPressable:{
        borderWidth: ".1em",
        borderRadius: "1em",
        padding: ".4em",
        borderColor: "grey" 
    },
    optionPressableText:{
        fontSize: "1.2em",
        color: BLUE,
    },
    support:{
        borderBottomWidth: ".1em",
        borderBottomColor: "grey",
        margin: ".5em"
    },
    guideTitle:{
        fontSize: "1.3em",
        fontWeight: "bold"
    },
    guideParagraph:{
        marginVertical: ".3em"
    },
    paymentContainer:{
        alignItems: "center",
        marginBottom: "1em",
    },
    paymentMiniContainer:{
        alignItems: "center",
        margin: "1em",
    },
    paymentInput:{
        fontSize: ".8em",
        textAlign: "center",
        borderBottomWidth: ".05em",
        borderBottomColor: "grey",
        marginVertical: ".2em"
    },
    paymentPressable:{
        borderWidth: ".05em",
        borderRadius: ".5em",
        padding: ".2em",
        borderColor: "grey" 
    },
    paymentPressableMini:{
        borderBottomWidth: ".05em",
        padding: ".2em",
        borderBottomColor: "grey" 
    },
    paymentPressableText:{
        fontSize: ".8em",
        color: BLUE,
    },
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~EARN~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    earnTitle:{
        backgroundColor: MORE_FADED_BLUE,
        height: navHeight,
        width: ScreenWidth,
        textAlign: "center",
        paddingTop: ".2em",
        fontSize: "1.2em"
    },
    earnTop:{
        backgroundColor: BLUE,
        width: ScreenWidth,
        alignItems: "center"
    },
    earnTextBig:{
        fontSize: "1em"
    },
    earnTextIcon:{
        width: "1.7em",
        height: "1.7em",
        marginVertical: ".3em"
    },
    earnText:{
        fontSize: ".8em",
        marginBottom: ".3em"
    },
    earnNavigator:{
        flexDirection: "row",
        zIndex: 1,
        width: ScreenWidth,
        backgroundColor: FADED_BLUE,
        paddingTop: ".5em",
    },
    earnNavPressable:{
        width: ScreenWidth/6,
        textAlign: "center",
        padding: ".1em"
    },
    earnNavPressablePressed:{
        width: ScreenWidth/6,
        textAlign: "center",
        padding: ".1em",
        borderBottomColor: "red",
        borderBottomWidth: ".2em",
    },
    earnNavPressableText:{
        fontSize: ".7em"
    },
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~LEVEL~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    level:{
        width: ScreenWidth/1.1,
        padding: ".5em",
        paddingRight: ".7em",
        margin: ".5em",
        borderRadius: "1em",
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: MORE_FADED_BLUE,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        justifyContent: "space-between",
    },
    levelIconAndText:{
        flexDirection: "row"
    },
    levelIcon:{
        width: "2.5em",
        height: "2.5em"
    },
    levelTextContainer:{
        flexDirection: "column"
    },
    levelTextSmall:{
        fontSize: ".6em",
    },
    levelRight:{
        alignSelf: "flex-end",
    },
    levelPressable:{
        backgroundColor: BLUE,
        paddingVertical: ".2em",
        paddingHorizontal: ".4em",
        borderRadius: ".4em"
    },
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TASK~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    taskNavigator:{
        flexDirection: "row",
        zIndex: 1,
        width: ScreenWidth,
        backgroundColor: BLUE,
        paddingTop: ".5em",
    },
    taskNavPressable:{
        marginTop: "1em",
        width: ScreenWidth/4,
        textAlign: "center",
        padding: ".2em"
    },
    taskNavPressablePressed:{
        marginTop: "1em",
        width: ScreenWidth/4,
        textAlign: "center",
        padding: ".2em",
        borderBottomColor: "red",
        borderBottomWidth: ".2em",
    },
    taskNavPressableText:{
        fontSize: "1em"
    },
    expandedMedia:{
        height: "auto",
    },
    upload:{
        paddingVertical: ".4em",
        flexDirection: "column",
        flexGrow: "column",
        justifyContent: "flex-start",
        alignSelf: "flex-start",
        padding: ".6em"
    },
    uploadLink:{
    },
    uploadLinkText:{
        color: "white",
        marginVertical: ".2em",
        fontSize: "1.2em"
    },
    uploadLinkTextTop:{
        alignSelf: "center",
        cursor: "pointer"
    },
    uploadLinkTextTopWrapper:{
        width: ScreenWidth/1.2,
        alignText: "center",
    },
    uploadInput:{
        fontSize: "1.2em"
    },
    uploadButton:{
        backgroundColor: BLUE,
        borderRadius: "1em",
        textAlign: "center",
        marginVertical: ".5em",
        width: ScreenWidth/1.2
    },
    hidden:{
        display: "none"
    }
});
