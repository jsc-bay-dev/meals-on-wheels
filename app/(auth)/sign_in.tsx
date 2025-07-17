import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { SignIn } from '@/lib/appwrite'
import * as Sentry from '@sentry/react-native'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const sign_in = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const submit = async () => {
    if (!form.email || !form.password) return Alert.alert('Error', 'Please enter vald email address & password')

    setIsSubmitting(true);

    try {
      await SignIn({ email: form.email, password: form.password })
      router.replace('/')
    } catch (error: any) {
      Alert.alert('Error', error.message)
      Sentry.captureEvent(error)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">

      <CustomInput
        placeholder='Enter your email'
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        label='email'
        keyboardType='email-address'
      />
      <CustomInput
        placeholder='Enter your password'
        value={form.password}
        onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
        label='Password'
        secureTextEntry={true}
      />
      <CustomButton
        title="Sign In"
        isLoading={isSubmitting}
        onPress={submit}
      >

      </CustomButton>
      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Don't have an account?
        </Text>
        <Link href="/sign_up" className="base-bold text-primary">
          Sign up!
        </Link>
      </View>
    </View>
  )
}

export default sign_in