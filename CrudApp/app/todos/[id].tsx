import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";

import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Octicons from "@expo/vector-icons/Octicons"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Todo } from "@/data/todos";

export default function EditScreen() {
  const { id } = useLocalSearchParams()
  const [todo, setTodo] = useState<Todo | null>(null)
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async (id: string) => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp")
        const storageTodos: Todo[] = jsonValue != null ? JSON.parse(jsonValue) : null

        if (storageTodos && storageTodos.length) {
          const myTodo: Todo | undefined = storageTodos.find(todo => todo.id.toString() === id)

          if (myTodo) {
            setTodo(myTodo)
          } else {
            router.back()
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchData(id as string)
  }, [id])

  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  const handleSave = async () => {
    try {
      if (todo) {
        const savedTodo = { ...todo, title: todo.title }
        const jsonValue = await AsyncStorage.getItem("TodoApp")
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

        if (storageTodos && storageTodos.length) {
          const otherTodos = storageTodos.filter((todo: Todo) => todo.id !== savedTodo.id)
          const allTodos = [...otherTodos, savedTodo]
          await AsyncStorage.setItem('TodoApp', JSON.stringify(allTodos))
        } else {
          await AsyncStorage.setItem('TodoApp', JSON.stringify(savedTodo))
        }
        router.push('/')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const styles = createStyles(theme, colorScheme)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Edit todo"
          placeholderTextColor="gray"
          value={todo?.title || ''}
          onChangeText={(text) => setTodo(prev => {
            if (prev === null) return null;
            return {...prev, title: text};
          })}
        />
        <Pressable
        onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
          style={{ marginLeft: 10 }}
        >
          {colorScheme === 'dark'
            ? <Octicons name="moon" size={36} color={theme.text} selectable={undefined} style={{ width: 36 }} />
            : <Octicons name="sun" size={36} color={theme.text} selectable={undefined} style={{ width: 36 }} />
          }

        </Pressable>
      </View>
      <View style={styles.inputContainer}>
        <Pressable
          onPress={handleSave}
          style={styles.saveButton}
        >
          <Text style={styles.saveBtuttonText}>Save</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/')}
          style={[styles.saveButton, {backgroundColor: 'red'}]}
        >
          <Text style={[styles.saveBtuttonText, {color: 'white'}]}>Cancel</Text>
        </Pressable>
      </View>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

    </SafeAreaView>
  )
}

function createStyles(theme: ThemeContextType['theme'], colorScheme: ThemeContextType['colorScheme']) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding:10,
      gap: 6,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
    },
    input: {
      flex: 1,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      minWidth: 0,
      color: theme.text,
    },
    saveButton: {
      padding: 10,
      backgroundColor: 'blue',
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    saveBtuttonText: {
      color: 'white',
      fontSize: 16,
      fontFamily: 'Inter_500Medium',
    }
  })
}