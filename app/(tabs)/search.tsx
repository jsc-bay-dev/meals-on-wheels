import seed from '@/lib/seed'
import React from 'react'
import { Button, SafeAreaView, Text } from 'react-native'

const search = () => {
  return (
    <SafeAreaView>
      <Text>Search</Text>
      <Button
        title="seed"
        onPress={() => seed()
          .catch((e) => console.log('Failed to seed the database.', e))
        }
      />
    </SafeAreaView>
  )
}

export default search