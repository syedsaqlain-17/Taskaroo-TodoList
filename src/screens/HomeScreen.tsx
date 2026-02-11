import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, 
  TextInput, View, Alert, TouchableOpacity, Platform 
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  deadline: any;
  createdAt: any;
}

const HomeScreen: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [loading, setLoading] = useState(true);
  const [deadline, setDeadline] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  
  // Toggle State: 'mixed' (Priority first) or 'deadline' (Closest date first)
  const [sortMode, setSortMode] = useState<'mixed' | 'deadline'>('mixed');

  const user = auth().currentUser;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('todos')
      .onSnapshot(snapshot => {
        const list: TodoItem[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<TodoItem, 'id'>),
        }));

        // --- IMPROVED SORTING ALGORITHM ---
        const sorted = [...list].sort((a, b) => {
          // Rule 1: Always drop completed tasks to the bottom
          if (a.completed !== b.completed) return a.completed ? 1 : -1;

          const timeA = a.deadline?.toDate ? a.deadline.toDate().getTime() : new Date(a.deadline).getTime() || 0;
          const timeB = b.deadline?.toDate ? b.deadline.toDate().getTime() : new Date(b.deadline).getTime() || 0;

          if (sortMode === 'mixed') {
            // Priority First Logic
            const weights = { high: 3, medium: 2, low: 1 };
            const weightA = weights[a.priority] || 0;
            const weightB = weights[b.priority] || 0;

            if (weightA !== weightB) return weightB - weightA;
            return timeA - timeB; // Tie-breaker: Deadline
          } else {
            // Deadline Only Logic
            return timeA - timeB;
          }
        });

        setTodos(sorted);
        setLoading(false);
      }, error => {
        console.error("Sorting Error:", error);
        setLoading(false);
      });

    return unsubscribe;
  }, [user, sortMode]); // Re-run when sortMode changes

  const addTodo = async () => {
    if (!user || !title.trim()) return Alert.alert("Taskaroo", "Title is required");
    try {
      await firestore().collection('users').doc(user.uid).collection('todos').add({
        title, description, priority, completed: false,
        deadline: firestore.Timestamp.fromDate(deadline),
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      setTitle(''); setDescription('');
    } catch (e) { Alert.alert("Error", "Save failed"); }
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#166534" />
      
      <View style={styles.header}>
        <View style={styles.brand}>
          <Text style={styles.logo}>📝</Text>
          <Text style={styles.headerTitle}>Taskaroo</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => auth().signOut()}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* INPUT BOX */}
        <View style={styles.addBox}>
          <TextInput 
            placeholder="What's the task?" value={title} onChangeText={setTitle} 
            style={styles.input} placeholderTextColor="#94A3B8" 
          />
          <TouchableOpacity style={styles.dateBtn} onPress={() => setShowPicker(true)}>
            <Text style={styles.dateText}>📅 Due: {deadline.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showPicker && <DateTimePicker value={deadline} mode="date" onChange={(e, d) => { setShowPicker(false); if(d) setDeadline(d); }} />}
          
          <View style={styles.priorityRow}>
            {['low', 'medium', 'high'].map(p => (
              <TouchableOpacity key={p} style={[styles.pBtn, priority === p && styles.pSelected]} onPress={() => setPriority(p as any)}>
                <Text style={[styles.pText, priority === p && {color: 'white'}]}>{p.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={addTodo}><Text style={styles.addBtnText}>Add to Notepad</Text></TouchableOpacity>
        </View>

        {/* SORT TOGGLE BAR */}
        <View style={styles.sortBar}>
          <Text style={styles.sortLabel}>Sort By:</Text>
          <TouchableOpacity 
            style={[styles.toggleBtn, sortMode === 'mixed' && styles.toggleActive]} 
            onPress={() => setSortMode('mixed')}
          >
            <Text style={[styles.toggleText, sortMode === 'mixed' && {color: 'white'}]}>Priority</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, sortMode === 'deadline' && styles.toggleActive]} 
            onPress={() => setSortMode('deadline')}
          >
            <Text style={[styles.toggleText, sortMode === 'deadline' && {color: 'white'}]}>Deadline</Text>
          </TouchableOpacity>
        </View>

        {/* LIST SECTION */}
        <View style={styles.listContainer}>
          {todos.map(item => (
            <View key={item.id} style={[styles.card, 
              item.priority === 'high' ? styles.borderRed : 
              item.priority === 'medium' ? styles.borderYellow : styles.borderGreen]}>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, item.completed && styles.completed]}>{item.title}</Text>
                <Text style={styles.cardDeadline}>⏰ {item.deadline?.toDate ? item.deadline.toDate().toLocaleDateString() : new Date(item.deadline).toLocaleDateString()}</Text>
              </View>
              <TouchableOpacity onPress={() => firestore().collection('users').doc(user.uid).collection('todos').doc(item.id).update({ completed: !item.completed })}>
                <Text style={styles.icon}>{item.completed ? '↩️' : '✅'}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  header: { backgroundColor: '#166534', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center' },
  logo: { fontSize: 24, marginRight: 8 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: '900' },
  logoutBtn: { backgroundColor: '#14532D', padding: 8, borderRadius: 10 },
  logoutText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  addBox: { backgroundColor: 'white', margin: 15, padding: 20, borderRadius: 20, elevation: 4 },
  input: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  dateBtn: { padding: 12, backgroundColor: '#DCFCE7', borderRadius: 10, marginBottom: 12, alignItems: 'center' },
  dateText: { color: '#166534', fontWeight: 'bold' },
  priorityRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  pBtn: { flex: 1, borderWidth: 1, borderColor: '#22C55E', padding: 8, borderRadius: 8, marginHorizontal: 2, alignItems: 'center' },
  pSelected: { backgroundColor: '#22C55E' },
  pText: { fontSize: 10, fontWeight: 'bold', color: '#22C55E' },
  addBtn: { backgroundColor: '#166534', padding: 15, borderRadius: 12, alignItems: 'center' },
  addBtnText: { color: 'white', fontWeight: 'bold' },
  sortBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 5 },
  sortLabel: { fontSize: 12, fontWeight: 'bold', color: '#64748B', marginRight: 10 },
  toggleBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15, marginRight: 8, backgroundColor: '#E2E8F0' },
  toggleActive: { backgroundColor: '#166534' },
  toggleText: { fontSize: 11, fontWeight: 'bold', color: '#64748B' },
  listContainer: { padding: 15 },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 15, marginBottom: 12, borderLeftWidth: 6, flexDirection: 'row', justifyContent: 'space-between', elevation: 2 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#1E293B' },
  cardDeadline: { fontSize: 12, color: '#64748B', marginTop: 4 },
  icon: { fontSize: 22, marginLeft: 15 },
  completed: { textDecorationLine: 'line-through', color: '#CBD5E1' },
  borderRed: { borderLeftColor: '#EF4444' },
  borderYellow: { borderLeftColor: '#EAB308' },
  borderGreen: { borderLeftColor: '#22C55E' }
});

export default HomeScreen;