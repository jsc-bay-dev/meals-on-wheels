import { images } from '@/constants';
import { CustomButtonProps } from '@/type';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const CartButton = ({
    onPress,
    title="Click Me",
    style,
    textStyle,
    leftIcon,
    isLoading = false
}: CustomButtonProps) => {
    const totalItems = 10;
    
  return (

    <TouchableOpacity className="cart-btn" onPress={()=>{}}>
        <Image source={images.bag} className="size-5" resizeMode="contain"></Image>
      

        {
            totalItems > 0 && (
                <View className="cart-badge">
                    <Text className="small-bold text-white">
                        {totalItems}
                    </Text>

                </View>
            )
        }
    </TouchableOpacity>
  )
}

export default CartButton