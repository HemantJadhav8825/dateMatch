const { StyleSheet } = require("react-native");

const styles = StyleSheet.create({
    container: {
        padding: 25,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 30,
        color: '#222',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        color: '#444',
    },
    button: {
        backgroundColor: '#4a00e0',
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: '#ff4d4d',
    },
    logoutButtonText: {
        fontWeight: '700',
    },
});

export default styles;