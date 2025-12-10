import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LeaderboardScreen = ({ navigation }) => {
    const [scores, setScores] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            loadScores();
        }, [])
    );

    const loadScores = async () => {
    try {
        const history = await AsyncStorage.getItem('scoreHistory');
        if (history) {
            const parsedScores = JSON.parse(history);
            
            // ✅ SKORLARI SIRALA: Büyükten küçüğe (b.score - a.score)
            const sortedScores = parsedScores.sort((a, b) => b.score - a.score);
            
            // Sıralanmış skorları state'e aktar
            setScores(sortedScores);
        } else {
            setScores([]);
        }
    } catch (error) {
        console.log('Error loading scores:', error);
        setScores([]);
    }
};

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const clearHistory = async () => {
        try {
            await AsyncStorage.removeItem('scoreHistory');
            setScores([]);
            console.log('Skor geçmişi temizlendi');
        } catch (error) {
            console.log('Error clearing history:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Geri</Text>
                </TouchableOpacity>
                <Text style={styles.title}>🏆 Skor Tablosu</Text>
                <View style={{ width: 50 }} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {scores.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Henüz hiç oyun oynamadın!</Text>
                        <Text style={styles.emptySubtext}>Hadi bir oyun oyna! 🐍</Text>
                    </View>
                ) : (
                    scores.map((item, index) => (
                        <View key={index} style={styles.scoreItem}>
                            <View style={styles.rankContainer}>
                                <Text style={styles.rank}>#{index + 1}</Text>
                            </View>
                            <View style={styles.scoreInfo}>
                                <Text style={styles.scoreValue}>{item.score} puan</Text>
                                <Text style={styles.scoreDate}>{formatDate(item.date)}</Text>
                            </View>
                            <View style={styles.medal}>
                                {index === 0 && <Text style={styles.medalText}>🥇</Text>}
                                {index === 1 && <Text style={styles.medalText}>🥈</Text>}
                                {index === 2 && <Text style={styles.medalText}>🥉</Text>}
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {scores.length > 0 && (
                <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={clearHistory}
                >
                    <Text style={styles.clearButtonText}>🗑️ Geçmişi Temizle</Text>
                </TouchableOpacity>
            )}
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: '#ffffff',
        fontSize: 20,
        marginBottom: 10,
    },
    emptySubtext: {
        color: '#4ecca3',
        fontSize: 16,
    },
    scoreItem: {
        flexDirection: 'row',
        backgroundColor: '#16213e',
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#0f3460',
    },
    rankContainer: {
        width: 50,
        alignItems: 'center',
    },
    rank: {
        color: '#4ecca3',
        fontSize: 20,
        fontWeight: 'bold',
    },
    scoreInfo: {
        flex: 1,
        marginLeft: 10,
    },
    scoreValue: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    scoreDate: {
        color: '#999',
        fontSize: 12,
        marginTop: 5,
    },
    medal: {
        width: 40,
        alignItems: 'center',
    },
    medalText: {
        fontSize: 30,
    },
    clearButton: {
        backgroundColor: '#e94560',
        margin: 20,
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LeaderboardScreen;