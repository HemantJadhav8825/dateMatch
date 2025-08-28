import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    useColorScheme,
    TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axiosClient from '../../api/axiosClient';
import Toast from 'react-native-toast-message';

const UserInfoScreen = ({ navigation }) => {
    const scheme = useColorScheme();
    const [nickname, setNickname] = useState('');
    const [gender, setGender] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!nickname.trim() || !gender.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Missing information',
                text2: 'Please provide both nickname and gender',
            });
            return;
        }
        setLoading(true);
        try {
            const { data } = await axiosClient.patch('/user/user/me', {
                nickname,
                gender,
            });
            if (data) {
                navigation.replace('Home');
            }
        } catch (error) {
            console.error('Error saving user info:', error?.response?.data);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error?.response?.data?.error || 'Could not save details',
            });
        } finally {
            setLoading(false);
        }
    };

    const renderGenderButton = (label) => (
        <TouchableOpacity
            key={label}
            onPress={() => setGender(label)}
            style={{
                flex: 1,
                backgroundColor: gender === label ? '#4a00e0' : 'rgba(255,255,255,0.2)',
                paddingVertical: 14,
                marginHorizontal: 6,
                borderRadius: 12,
                borderWidth: gender === label ? 0 : 1,
                borderColor: 'rgba(255,255,255,0.3)',
                alignItems: 'center',
                shadowColor: gender === label ? '#000' : 'transparent',
                shadowOpacity: 0.2,
                shadowRadius: 4,
            }}
        >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <LinearGradient
            colors={scheme === 'dark' ? ['#0f2027', '#203a43', '#2c5364'] : ['#8e2de2', '#4a00e0']}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 24,
                    paddingTop: 60,
                    paddingBottom: 40,
                    justifyContent: 'center',
                }}
            >
                <Text
                    style={{
                        fontSize: 28,
                        fontWeight: '700',
                        color: '#fff',
                        marginBottom: 12,
                        textAlign: 'center',
                    }}
                >
                    Complete Your Profile
                </Text>
                <Text
                    style={{
                        fontSize: 15,
                        color: 'rgba(255,255,255,0.8)',
                        marginBottom: 30,
                        textAlign: 'center',
                    }}
                >
                    Just a few more details before you start!
                </Text>

                <TextInput
                    placeholder="Enter your nickname"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={nickname}
                    onChangeText={setNickname}
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        color: '#fff',
                        borderRadius: 14,
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        marginBottom: 25,
                        fontSize: 16,
                    }}
                />

                <Text style={{ color: '#fff', marginBottom: 12, fontSize: 16, fontWeight: '500' }}>
                    Select Gender
                </Text>
                <View style={{ flexDirection: 'row', marginBottom: 40 }}>
                    {['Male', 'Female', 'Other'].map(renderGenderButton)}
                </View>

                <TouchableOpacity
                    style={{
                        backgroundColor: loading ? 'rgba(255,255,255,0.3)' : '#fff',
                        paddingVertical: 16,
                        borderRadius: 14,
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOpacity: 0.2,
                        shadowRadius: 6,
                    }}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#4a00e0" />
                    ) : (
                        <Text style={{ color: '#4a00e0', fontSize: 18, fontWeight: '700' }}>
                            Save & Continue
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

export default UserInfoScreen;
