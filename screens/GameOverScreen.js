import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfettiCannon from 'react-native-confetti-cannon'; // ✅ Konfeti eklendi

const GameOverScreen = ({ route, navigation }) => {
    const { score } = route.params;
    const [highScore, setHighScore] = useState(0);
    const [isNewRecord, setIsNewRecord] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current; // ✅ Yeni rekor yazısı için animasyon

    useEffect(() => {
        checkHighScore();
        // Yazının yavaşça belirmesi için
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const checkHighScore = async () => {
        try {
            const savedHighScore = await AsyncStorage.getItem('highScore');
            const high = savedHighScore ? parseInt(savedHighScore) : 0;
            
            setHighScore(high);
            
            // ✅ Yeni rekor kontrolü (Skor eski rekoru geçtiyse veya eşitse)
            if (score >= high && score > 0) {
                setIsNewRecord(true);
            }
        } catch (error) {
            console.log('Error checking high score:', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* ✅ REKOR VARSA KONFETİ PATLAT */}
            {isNewRecord && (
                <ConfettiCannon 
                    count={200} 
                    origin={{x: -10, y: 0}} 
                    fallSpeed={3000}
                    fadeOut={true}
                />
            )}

            <Text style={styles.title}>GAME OVER</Text>
            
            {/* ✅ ESKİ BADGE YERİNE ANİMASYONLU REKOR YAZISI */}
            {isNewRecord && (
                <Animated.View style={[styles.recordBadge, { opacity: fadeAnim }]}>
                    <Text style={styles.recordText}>🎉 YENİ REKOR! 🎉</Text>
                </Animated.View>
            )}
            
            <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Skorun</Text>
                <Text style={styles.score}>{score}</Text>
            </View>
            
            <View style={styles.highScoreContainer}>
                <Text style={styles.highScoreLabel}>En Yüksek Skor</Text>
                <Text style={styles.highScore}>{highScore}</Text>
            </View>
            
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('Game')}
            >
                <Text style={styles.buttonText}>🔄 Tekrar Oyna</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]}
                onPress={() => navigation.navigate('Leaderboard')}
            >
                <Text style={styles.buttonText}>🏆 Skor Tablosu</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[styles.button, styles.tertiaryButton]}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.buttonText}>🏠 Ana Menü</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#e94560',
        marginBottom: 20,
    },
    recordBadge: {
        backgroundColor: '#4ecca3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginBottom: 20,
        // ✅ Yeni: Rekor yazısına hafif bir parlama efekti
        shadowColor: "#4ecca3",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    recordText: {
        color: '#1a1a2e',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scoreContainer: {
        backgroundColor: '#16213e',
        padding: 30,
        borderRadius: 20,
        marginBottom: 20,
        width: '80%',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#e94560',
    },
    scoreLabel: {
        color: '#ffffff',
        fontSize: 18,
        marginBottom: 5,
    },
    score: {
        color: '#e94560',
        fontSize: 64,
        fontWeight: 'bold',
    },
    highScoreContainer: {
        backgroundColor: '#0f3460',
        padding: 15,
        borderRadius: 15,
        marginBottom: 30,
        width: '80%',
        alignItems: 'center',
    },
    highScoreLabel: {
        color: '#4ecca3',
        fontSize: 14,
        marginBottom: 5,
    },
    highScore: {
        color: '#ffffff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#4ecca3',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginVertical: 6,
        width: '80%',
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: '#0f3460',
    },
    tertiaryButton: {
        backgroundColor: '#533483',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GameOverScreen;