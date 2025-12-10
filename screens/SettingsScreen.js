import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
    const [selectedSpeed, setSelectedSpeed] = useState('normal');
    const [wallMode, setWallMode] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const speed = await AsyncStorage.getItem('gameSpeed');
            if (speed) setSelectedSpeed(speed);
            
            const mode = await AsyncStorage.getItem('wallMode');
            setWallMode(mode === 'true');
        } catch (error) {
            console.log('Error loading settings:', error);
        }
    };

    const saveSpeed = async (speed) => {
        try {
            await AsyncStorage.setItem('gameSpeed', speed);
            setSelectedSpeed(speed);
        } catch (error) {
            console.log('Error saving speed:', error);
        }
    };

    const toggleWallMode = async () => {
        try {
            const newMode = !wallMode;
            setWallMode(newMode);
            await AsyncStorage.setItem('wallMode', newMode.toString());
        } catch (error) {
            console.log('Error toggling wall mode:', error);
        }
    };

    const resetAllData = () => {
        Alert.alert(
            'Tüm Verileri Sil',
            'Tüm skorlar ve ayarlar silinecek. Emin misin?',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.multiRemove(['highScore', 'scoreHistory', 'gameSpeed', 'wallMode']);
                            setSelectedSpeed('normal');
                            setWallMode(false);
                            Alert.alert('Başarılı', 'Tüm veriler silindi!');
                        } catch (error) {
                            console.log('Error resetting data:', error);
                        }
                    }
                }
            ]
        );
    };

    const speedOptions = [
        { value: 'slow', label: 'Yavaş', emoji: '🐢', description: 'Yeni başlayanlar için' },
        { value: 'normal', label: 'Normal', emoji: '🐍', description: 'Dengeli hız' },
        { value: 'fast', label: 'Hızlı', emoji: '⚡', description: 'Deneyimliler için' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Geri</Text>
                </TouchableOpacity>
                <Text style={styles.title}>⚙️ Ayarlar</Text>
                <View style={{ width: 50 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Oyun Hızı</Text>
                
                {speedOptions.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.speedOption,
                            selectedSpeed === option.value && styles.speedOptionSelected
                        ]}
                        onPress={() => saveSpeed(option.value)}
                    >
                        <Text style={styles.speedEmoji}>{option.emoji}</Text>
                        <View style={styles.speedInfo}>
                            <Text style={styles.speedLabel}>{option.label}</Text>
                            <Text style={styles.speedDescription}>{option.description}</Text>
                        </View>
                        {selectedSpeed === option.value && (
                            <Text style={styles.checkmark}>✓</Text>
                        )}
                    </TouchableOpacity>
                ))}

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Oyun Modu</Text>

                <TouchableOpacity
                    style={[styles.speedOption, wallMode && styles.speedOptionSelected]}
                    onPress={toggleWallMode}
                >
                    <Text style={styles.speedEmoji}>🧱</Text>
                    <View style={styles.speedInfo}>
                        <Text style={styles.speedLabel}>Duvar Modu</Text>
                        <Text style={styles.speedDescription}>Elmayı her yediğinde duvarlar yer değiştirir</Text>
                    </View>
                    {wallMode && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Veri Yönetimi</Text>
                
                <TouchableOpacity 
                    style={styles.dangerButton}
                    onPress={resetAllData}
                >
                    <Text style={styles.dangerButtonText}>🗑️ Tüm Verileri Sil</Text>
                </TouchableOpacity>

                <Text style={styles.infoText}>
                    Bu işlem tüm skorlarınızı, geçmişinizi ve ayarlarınızı silecektir.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: '#16213e',
    },
    backButton: {
        color: '#4ecca3',
        fontSize: 18,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        color: '#4ecca3',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 10,
    },
    speedOption: {
        flexDirection: 'row',
        backgroundColor: '#16213e',
        padding: 20,
        borderRadius: 15,
        marginBottom: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#0f3460',
    },
    speedOptionSelected: {
        borderColor: '#4ecca3',
        backgroundColor: '#0f3460',
    },
    speedEmoji: {
        fontSize: 32,
        marginRight: 15,
    },
    speedInfo: {
        flex: 1,
    },
    speedLabel: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    speedDescription: {
        color: '#999',
        fontSize: 14,
        marginTop: 3,
    },
    checkmark: {
        color: '#4ecca3',
        fontSize: 24,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#0f3460',
        marginVertical: 30,
    },
    dangerButton: {
        backgroundColor: '#e94560',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 10,
    },
    dangerButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoText: {
        color: '#999',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 10,
    },
});

export default SettingsScreen;