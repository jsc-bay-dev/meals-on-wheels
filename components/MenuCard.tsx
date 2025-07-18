import { MenuItem } from "@/type";
import { Image, Text, TouchableOpacity } from 'react-native';

const MenuCard = ({ item: { image_url, name, price } }: { item: MenuItem }) => {
    

    return (
        <TouchableOpacity >
            <Text>Menu Item

            </Text>
            <Image source={{ uri: image_url }} className="size-32 absolute -top-10" resizeMode="contain" />
        </TouchableOpacity>
    )
}
export default MenuCard
