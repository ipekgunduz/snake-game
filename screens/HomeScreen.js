import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
    const [highScore, setHighScore] = useState(0);

    // Ekran her açıldığında high score'u yükle
    useFocusEffect(
        React.useCallback(() => {
            loadHighScore();
        }, [])
    );

    const loadHighScore = async () => {
        try {
            const score = await AsyncStorage.getItem('highScore');
            console.log('Yüklenen high score:', score); // Debug
            if (score) {
                setHighScore(parseInt(score));
            } else {
                setHighScore(0);
            }
        } catch (error) {
            console.log('Error loading high score:', error);
        }
    };

    return (
        <LinearGradient
            colors={['#0f2027', '#203a43', '#2c5364']}
            style={styles.container}
        >
            <Text style={styles.title}>🐍 SNAKE</Text>
            <Text style={styles.subtitle}>Classic Snake Game</Text>
            
            <View style={styles.scoreContainer}>
                <Text style={styles.highScoreLabel}>En Yüksek Skor</Text>
                <Text style={styles.highScore}>{highScore}</Text>
            </View>
            
            <TouchableOpacity 
                style={styles.buttonWrapper}
                onPress={() => navigation.navigate('Game')}
            >
                <LinearGradient
                    colors={['#4ecca3', '#229879']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>🎮 Oyuna Başla</Text>
                </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.buttonWrapper}
                onPress={() => navigation.navigate('Leaderboard')}
            >
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>🏆 Skor Tablosu</Text>
                </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.buttonWrapper}
                onPress={() => navigation.navigate('Settings')}
            >
                <LinearGradient
                    colors={['#f093fb', '#f5576c']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>⚙️ Ayarlar</Text>
                </LinearGradient>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 72,
        fontWeight: 'bold',
        color: '#4ecca3',
        marginBottom: 10,
        textShadowColor: 'rgba(78, 204, 163, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    subtitle: {
        fontSize: 18,
        color: '#ffffff',
        marginBottom: 40,
        opacity: 0.8,
    },
    scoreContainer: {
        backgroundColor: 'rgba(22, 33, 62, 0.6)',
        padding: 25,
        borderRadius: 20,
        marginBottom: 40,
        width: '85%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(78, 204, 163, 0.3)',
    },
    highScoreLabel: {
        color: '#4ecca3',
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '600',
    },
    highScore: {
        color: '#ffffff',
        fontSize: 56,
        fontWeight: 'bold',
    },
    buttonWrapper: {
        width: '85%',
        marginVertical: 8,
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    button: {
        paddingVertical: 18,
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default HomeScreen;