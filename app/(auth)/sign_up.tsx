import { router } from 'expo-router'
import React from 'react'
import { Button, Text, View } from 'react-native'

export default function sign_up() {
  return (
    <View>
      <Text>sign_up</Text>
      <Button title="Sign In" onPress={() => router.push("/sign_in")} />

    </View>
  )
}