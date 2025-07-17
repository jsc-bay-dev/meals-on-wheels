import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { createUser } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const [isSubmitting, setIsSubmitting] = useState(false)
const [form, setForm] = useState({name: '', email: '', password: '', verify_password: ''})

const sign_up = () => {
    const submit = async () => {
      if (!form.name || !form.name) return Alert.alert('Error', 'Please enter your first and last name.')
      if (!form.email || !form.password) return Alert.alert('Error', 'Please enter vald email address & password.')
      if (form.password != form.verify_password) return Alert.alert('Error', 'Your passwords do not match.')

      setIsSubmitting(true);

      try {
        // Call Appwrite Sign up Function
        await createUser({
          email: form.email, password: form.password, name: form.name
        })

        Alert.alert('Success', 'User signed up successfully!');
       router.replace('/')
      } catch (error: any) {
        Alert.alert('Error', error.message)
        
      } finally {
        setIsSubmitting(false)
      }
    }
  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">

      <CustomInput
        placeholder='Enter your first name'
        value={form.name}
        onChangeText={(text) => setForm((prev)=>({...prev, first_name: text}))}
        label='First name'
      />
      <CustomInput
        placeholder='Enter your last name'
        value={form.name}
        onChangeText={(text) => setForm((prev)=>({...prev, last_name: text}))}
        label='Last name'
      />
      <CustomInput
        placeholder='Enter your email'
        value={form.email}
        onChangeText={(text) => setForm((prev)=>({...prev, email: text}))}
        label='email'
        keyboardType='email-address'
      />
      <CustomInput
        placeholder='Enter your password'
        value={form.password}
        onChangeText={(text) => setForm((prev)=>({...prev, password: text}))}
        label='Password'
        secureTextEntry={true}
      />
      <CustomInput
        placeholder='Verify your password'
        value={form.verify_password}
        onChangeText={(text) => setForm((prev)=>({...prev, verify_password: text}))}
        label='Verify Password'
        secureTextEntry={true}
      />
      <CustomButton
        title="Sign Up"
        isLoading={isSubmitting}
        onPress={submit}
      >

      </CustomButton>
      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Already have an account?
        </Text>
        <Link href="/sign_in" className="base-bold text-primary">
          Sign in!
        </Link>
      </View>
    </View>
  )
}

export default sign_up