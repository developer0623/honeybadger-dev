import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet,  ScrollView, TouchableOpacity } from 'react-native';
import { View, Text, Container } from 'native-base';
import * as Keychain from 'react-native-keychain';

import Fish from '../../assets/fish.svg';
import RightArrow from '../../assets/right-arrow.svg';
import Salmon from '../../assets/salmon.svg';
import Dolphin from '../../assets/dolphin.svg';
import Flag from '../../assets/flag.svg';
import Whiteflag from '../../assets/whiteflag.svg';
import GoldFishBlack from '../../assets/goldFish_black.svg';
import SalmonBlack from '../../assets/salmon_black.svg';
import DolphinBlack from '../../assets/dolphin_black.svg';
import { colors } from '../theme';
import CustomHeader from '../components/CustomHeader';
import {SeedPhraseProps} from './types';

const SecurityLevel = ({navigation}: SeedPhraseProps) => {
    const [securityLevel, setSecurityLevel] = useState("0");
    const [data, setData] = useState({
        phraseBackedUpFirst: false,
        phraseBackedUp: false,
        securitySetup: false
    });
    const [isAvailable, setAvailable] = useState(true);

    useLayoutEffect(() => {
        const loadInitialState = async () => {
            try {
                let data: any= await Keychain.getInternetCredentials('securitySetup');
                if (data) {
                    data = JSON.parse(data.password);
                    setData(data);
                    if (data.securitySetup && data.phraseBackedUp) {
                        setSecurityLevel("2");    
                    } else if(data.securitySetup || data.phraseBackedUp) {
                        setSecurityLevel("1");
                    } else {
                        setSecurityLevel("0");
                    }
                } else {
                    setSecurityLevel("0");
                    setAvailable(false);
                }
            } catch (error) {
                console.log("Keychain couldn't be accessed!", error);
            }
        };

        loadInitialState();
    }, []);

    const getSecurityLevelText = () => {
        if (securityLevel === "0") {
            return "Level 1: Goldfish";
        }

        if (securityLevel === "1") {
            return "Level 2: Savvy Salmon";
        }

        return "Level 3: Discreet Dolphin";
    }

    const getNextSecurityLevelText = () => {
        if (securityLevel === "0") {
            return "Level 2: Savvy Salmon";
        }

        if (securityLevel === "1") {
            return "Level 3: Discreet Dolphin";
        }

        return "";
    }

    const getSubText = () => {
        if (securityLevel === "0") {
            return "Your funds are not secure!";
        }

        if (securityLevel === "1" && (!isAvailable || data.phraseBackedUpFirst) ) {
            return "Recovery Phrase Backed Up";
        } else if(securityLevel === "1") {
            return "App Lock Enabled"
        }
        
        if (securityLevel === "2" && (!isAvailable || data.phraseBackedUpFirst)) {
            return "App Lock Enabled";
        } else if(securityLevel === "2") {
            return "Recovery Phrase Backed Up"
        }

        return "App Lock Enabled";
    }

    const getNextLevelText = () => {
        if (securityLevel === "0") {
            return "Your Security Level"
        }
        
        if (securityLevel === "1") {
            return "Next Level";
        }

        return "";
    }

    const handleNavigation = () => {
        if (securityLevel === '1' && (!isAvailable || data.phraseBackedUpFirst)) {
            navigation.navigate("AccountSetup")
        } else if(securityLevel === '1' && (!isAvailable || !data.phraseBackedUpFirst)) {
            navigation.navigate("RecoveryPhrase", {fromSetting: false});
        } else if(securityLevel === '0') {
            navigation.navigate("RecoveryPhrase", {fromSetting: false});
        }
    }

    const getSecurityLevelForStepper = (level: string) => {
        if (level === "0") {
            return "No Security";
        }

        if (level === "1" && (!isAvailable || data.phraseBackedUpFirst)) {
            return "Back Up Recovery Phrase";
        } else if(level === "1") {
            return "Enable App Lock"
        }
        
        if (level === "2" && (!isAvailable || data.phraseBackedUpFirst)) {
            return "Enable App Lock";
        } else if(level === "2") {
            return "Back Up Recovery Phrase"
        }

        return "Enable App Lock";
    }

    return (
            <Container style={styles.container}>
                <CustomHeader
                    title="Security Level"
                    onBack={() => navigation.goBack()} />
                <View style={{alignItems:"center", paddingBottom:34}}>
                    { securityLevel === "0" &&
                        <GoldFishBlack style={{width:91,height:68, marginTop:34, marginBottom:24}} />
                    }
                    { securityLevel === "1" &&
                        <SalmonBlack style={{width:91,height:68, marginTop:34, marginBottom:24}} />
                    }
                    { securityLevel === "2" &&
                        <DolphinBlack style={{width:91,height:68, marginTop:34, marginBottom:24}} />
                    }
                    <Text style={styles.typo1}>
                        { getSecurityLevelText() }
                    </Text>
                    <Text style={styles.typo5}>
                        { getSubText() }
                    </Text>
                </View>
                <ScrollView contentContainerStyle={{flexGrow: 1}}>
                    <View style={styles.content}>
                        { Number(securityLevel) < 2 &&
                            <TouchableOpacity style={styles.security} onPress={()=> handleNavigation()}>
                            <View>
                                { securityLevel === "0" &&
                                    <Fish style={{width:47,height:35,marginRight:16}}/>
                                }
                                { securityLevel === "1" &&
                                    <Salmon style={{width:47,height:35,marginRight:16}} />
                                }
                                { securityLevel === "2" &&
                                    <Dolphin style={{width:47,height:35,marginRight:16}} />
                                }
                            </View>
                            <View style={{ width: '70%' }}>
                                <Text style={styles.typo6}>{ getNextLevelText() }</Text>
                                <Text style={styles.typo3}>{ getNextSecurityLevelText() }</Text>
                            </View>
                            {/* <View style={{marginLeft: 10}}>
                                <Circle />
                            </View> */}
                            <View>
                                { securityLevel !== "2" &&
                                    <RightArrow style={{width:9,height:14,marginLeft:10}} />
                                }
                            </View>
                        </TouchableOpacity>}

                        <ScrollView contentContainerStyle={{flexGrow: 1}}>
                        <View>
                            <Text style={styles.typo3}>
                                Levels
                            </Text>
                            <View style={styles.levelMain}>
                                <View style={{paddingTop:18}}>
                                    { securityLevel === "0" &&
                                        <React.Fragment>
                                            <View style={styles.dotsContainer}>
                                                <Text style={styles.greyDots1}></Text>
                                                <Text style={styles.orangeDot1}></Text>
                                                <Text style={styles.greyLine1}></Text>
                                            </View>
                                            <View style={styles.dotsContainer}>
                                                <Text style={styles.greyDots1}></Text>
                                                <Text style={styles.greyLine1}></Text>
                                            </View>
                                            <View >
                                                <Text style={styles.greyDots3}></Text>
                                                <Flag style={{width:15,height:16,marginTop:-26,marginLeft:12}} />
                                            </View>
                                        </React.Fragment>
                                    }
                                    { securityLevel === "1" &&
                                        <React.Fragment>
                                            <View style={styles.dotsContainer}>
                                                <Text style={styles.greyDots2}></Text>
                                                <Text style={styles.orangeDot1}></Text>
                                                <Text style={styles.orangeLine1}></Text>
                                            </View>
                                            <View style={styles.dotsContainer}>
                                                <Text style={styles.greyDots1}></Text>
                                                <Text style={styles.orangeDot1}></Text>
                                                <Text style={styles.greyLine1}></Text>
                                            </View>
                                            <View >
                                                <Text style={styles.greyDots3}></Text>
                                                <Flag style={{width:15,height:16,marginTop:-26,marginLeft:12}} />
                                            </View>
                                        </React.Fragment>
                                    }
                                    {  securityLevel === "2" &&
                                        <React.Fragment>
                                            <View style={styles.dotsContainer}>
                                                <Text style={styles.greyDots2}></Text>
                                                <Text style={styles.orangeDot1}></Text>
                                                <Text style={styles.orangeLine1}></Text>
                                            </View>
                                            <View style={styles.dotsContainer}>
                                                <Text style={styles.greyDots2}></Text>
                                                <Text style={styles.orangeDot1}></Text>
                                                <Text style={styles.orangeLine1}></Text>
                                            </View>
                                            
                                            <View >
                                                <Text style={styles.orangeDot3}></Text>
                                                <Whiteflag style={{width:15,height:16,marginTop:-26,marginLeft:12}} />
                                            </View>
                                        </React.Fragment>
                                    }
                                </View>
                                <View>
                                    <View style={styles.levels}>
                                        <View>
                                            <Fish style={{width:47,height:35,marginRight:16}} />
                                        </View>
                                        <View>
                                            <Text style={styles.typo3}>Level 1: Goldfish</Text>
                                            <Text style={styles.typo6}>No Security</Text>
                                        </View>
                                    </View>
                                    <View style={styles.levels}>
                                        <View>
                                            <Salmon style={{width:47,height:35,marginRight:16}} />
                                        </View>
                                        <View>
                                            <Text style={styles.typo3}>Level 2: Savvy Salmon</Text>
                                            <Text style={styles.typo6}>{getSecurityLevelForStepper("1")}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.levels}>
                                        <View>
                                            <Dolphin style={{width:47,height:42,marginRight:29}} />
                                        </View>
                                        <View>
                                            <Text style={styles.typo3}>Level 3: Discreet Dolphin</Text>
                                            <Text style={styles.typo6}>{getSecurityLevelForStepper("2")}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        </ScrollView>
                    </View>
                </ScrollView>
            </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.bg,
    },
    content: {
        backgroundColor: '#ffffff',
        flexGrow: 1,
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        paddingHorizontal: 30,
        paddingTop:22
    },
    btn: {
        width: 256,
        height: 50,
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: '#4b4b4b',
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 30
    },
    typo1: {
        fontFamily: 'Roboto-Medium',
        fontSize: 24,
        fontWeight: '500',
        lineHeight: 24,
        color: '#3C3B3B',
        marginBottom:5
    },
    typo2: {
        fontFamily: 'Roboto-Medium',
        fontSize: 36,
        fontWeight: '500',
        color: 'rgb(26, 25, 25)',
    },
    typo3: {
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 27,
        textTransform: 'capitalize',
        color: '#4B4B4B'
    },
    typo4: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        fontWeight: 'normal',
    },
    typo5: {
        fontFamily: 'Roboto-Light',
        fontWeight: '300',
        fontSize: 18,
        letterSpacing: 0.67,
    },
    typo6: {
        fontFamily: 'Roboto-Light',
        fontWeight: '300',
        fontSize: 14,
    },
    inputField: {
        padding:13,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius:12,
        fontFamily: 'Roboto-Light',
        fontSize: 18,
        fontWeight: '300',
        marginBottom:30,
        lineHeight: 24,
        color: '#4D4D4D'
    },
    security: {
        borderRadius: 9,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.10,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 16,
        marginTop:20,
        marginBottom:20,
        backgroundColor: '#fff',
        width: '100%',
        flexDirection: 'row',
        alignItems:'center'
    },
    levelMain: {
        backgroundColor: '#fff',
        width: '100%',
        flexDirection: 'row',
        alignItems:'center'
    },
    levels: {
        marginTop:20,
        backgroundColor: '#fff',
        width: '100%',
        flexDirection: 'row',
        alignItems:'center'
    },
    dotsContainer: {
        height:60,
        marginLeft:6
    },
    greyDots1: {
        height:12,
        width:12,
        borderWidth:12,
        borderRadius: 12,
        borderColor:'#E8E8E8',
        marginRight:24,
    },
    greyDots2: {
        height:12,
        width:12,
        borderWidth:12,
        borderRadius: 12,
        borderColor:'#F5942A',
        marginRight:24,
    },
    greyDots3: {
        height:19,
        width:19,
        borderWidth:19,
        borderRadius: 19,
        borderColor:'#E8E8E8',
        marginRight:24,
        marginLeft:0,
    },
    orangeDot3: {
        height:19,
        width:19,
        borderWidth:19,
        borderRadius: 19,
        borderColor:'#F5942A',
        marginRight:24,
        marginLeft:0,
    },
    orangeDot1: {
        height:6,
        width:6,
        borderWidth:6,
        borderRadius: 6,
        borderColor:'#F5942A',
        marginTop:-18,
        marginLeft:5.5,
    },
    greyLine1: {
        width:3,
        height:40,
        backgroundColor: '#E8E8E8',
        position:'absolute',
        left:11,
        top:20,
    },
    orangeLine1: {
        width:3,
        height:40,
        backgroundColor: '#F5942A',
        position:'absolute',
        left:11,
        top:20,
    }
});

export default SecurityLevel;
