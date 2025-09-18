import {
StyleSheet,
Text,
TouchableOpacity,
FlatList,
View,
Alert,
ScrollView,
} from 'react-native';
import React, {useContext} from 'react';
import Header from '../Components/Header';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CartContext} from '../Context/CartContext';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import axios from '../Components/axios';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const ConfirmOrder = () => {
    const navigation = useNavigation();
    const route = useRoute();
    // const {cartItems: contextCartItems, totalPrice, user, token} = useContext(CartContext);
    // const {clearCart} = useContext(CartContext);
  // Use cartItems from route params first, fallback to context
    // const cartItems = route.params?.cartItems || contextCartItems || [];
    // const selectedPaymentMethod =
    // route.params?.selectedPaymentMethod || 'Not Selected';
    // const total = route.params?.total || totalPrice || 0;
    const {cartItems, totalPrice, user, token, clearCart} = useContext(CartContext);
    const { selectedPaymentMethod, selectedAddress } = route.params;
 
    console.log('ConfirmOrder - Cart Items:', cartItems);
    console.log('ConfirmOrder - Items count:', cartItems.length);
    console.log('ConfirmOrder - Total:', totalPrice);
 
    const handlePlaceOrder = async () => {
        try {
            // const token = await AsyncStorage.getItem('userToken');
            if(!token){
                Alert.alert('Not Logged In', 'Please log in to place an order.');
                return;
            }
            const userId = user?.id || await AsyncStorage.getItem('userId');
 
            if (!userId) {
                Alert.alert('User ID Missing', 'User ID not found. Please log in again.');
                return;
            }
            if (cartItems.length === 0) {
                Alert.alert('Empty Cart', 'Your cart is empty. Please add items before placing an order.');
                return;
            }
 
            const payload = {
                userId: user?.id || userId,
                total: totalPrice,
                order_items: cartItems.map(item => ({
                    productId: item.id,
                    product_name: item.name,
                    quantity: item.quantity,
                    product_image: item.image,  
                    product_price: item.price,
                    product_offer_price: item.offerPrice || item.offer_price || item.price, // fallback if no offer
                })),
                payment_method: selectedPaymentMethod || 'cash',
                address: selectedAddress || {},
            };
 
            console.log('Place Order Payload:', payload);
 
            const response = await axios.post('/place-order', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
 
            if (response.data.status === 1) {
                // Alert.alert('Order Placed', 'Your order has been placed successfully!');
                console.log('Order Placed Successfully:', response.data);
                const orderId = response.data?.data?.order_id || response.data?.data?.id;

                // const orderDetailsForDisplay = {
                //     orderId: orderId,
                //     selectedPaymentMethod: selectedPaymentMethod,
                //     total: totalPrice,
                //     cartItems: cartItems,
                // };
                // console.log('Navigating to PaymentMethod with params:', orderDetailsForDisplay);
                // await clearCart();
                if (orderId) {
                //     navigation.navigate('OrderDetails', { orderId });
                // }
                    // navigation.navigate('PaymentMethod', orderDetailsForDisplay);
                    navigation.navigate('PaymentMethod', {
                        orderId,
                        selectedPaymentMethod: 'Cash', // default Cash
                        selectedAddress,
                        // total: totalPrice,
                        // cartItems,
                    });
            } else {
                console.warn("No orderId in response:", response.data);
            }
            //  await clearCart();
        } else {
            Alert.alert('Order Failed', response.data.message || 'Please try again.');
            console.error('Order Placement Failed:', response.data);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            Alert.alert('Order Error', 'There was an error placing your order. Please try again.');
        }
    };
 
 
 
    const renderItem = ({item}) => (
        <View style={styles.itemCard}>
        <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemSubtotal}>₹{item.offerPrice || item.offer_price * item.quantity}</Text>
        </View>
        <View style={styles.itemDetailsContainer}>
            <View style={styles.itemDetailRow}>
            <Text style={styles.itemDetails}>Qty: {item.quantity}</Text>
            <Text style={styles.itemDetails}>Price: ₹{item.offerPrice || item.offer_price }</Text>
            </View>
        </View>
        </View>
    );
 
    return (
        <LinearGradient colors={COLORS.gradient} style={{flex: 1}}>
        <View style={styles.container}>
            <Header title="Confirm Order" />
 
            {cartItems.length > 0 ? (
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                <Text style={styles.title}>Order Summary</Text>
 
                <View style={styles.itemsContainer}>
                    <FlatList
                    data={cartItems}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => (
                        <View style={styles.separator} />
                    )}
                    />
                </View>
 
                <View style={styles.summarySection}>
                    <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Payment Method:</Text>
                    <Text style={styles.paymentValue}>
                        {selectedPaymentMethod}
                    </Text>
                    </View>
 
                    <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Amount:</Text>
                    <Text style={styles.totalAmount}>₹{totalPrice}</Text>
                    </View>
                </View>
 
                <LinearGradient
                    colors={COLORS.gradientButton}
                    style={styles.button}>
                    <TouchableOpacity
                    style={styles.buttonTouchable}
                    onPress={handlePlaceOrder}
                    activeOpacity={0.8}>
                    <Text style={styles.buttonText}>Place Order</Text>
                    </TouchableOpacity>
                </LinearGradient>
                </View>
            </ScrollView>
            ) : (
            <View style={styles.emptyContainer}>
                <Text style={styles.empty}>No items in cart</Text>
                <Text style={styles.emptySubtext}>
                Add some items to your cart to place an order
                </Text>
            </View>
            )}
        </View>
        </LinearGradient>
    );
};
 
export default ConfirmOrder;
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
       
    },
    scrollContainer: {
        flex: 1,
        marginTop: 10,
        marginBottom: 20,
        // alignItems: 'center',
 
    },
    scrollContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        elevation: 8,
        shadowColor: COLORS.black,
        shadowOffset: {
        width: 0,
        height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        padding: 20,
        marginBottom: 20,
   
    },
    title: {
        fontSize: 24,
        fontFamily: FONTS.Bold,
        color: COLORS.black,
        marginBottom: 20,
        textAlign: 'center',
    },
    itemsContainer: {
        marginBottom: 20,
    },
    itemCard: {
        backgroundColor: COLORS.lightgray,
        borderRadius: 12,
        padding: 16,
        marginVertical: 4,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemName: {
        fontSize: 16,
        fontFamily: FONTS.SemiBold,
        color: "black",
        flex: 1,
        marginRight: 10,
    },
    itemSubtotal: {
        fontSize: 16,
        fontFamily: FONTS.Bold,
        color: "red",
    },
    itemDetailsContainer: {
        marginTop: 4,
    },
    itemDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemDetails: {
        fontSize: 14,
        fontFamily: FONTS.Regular,
        color: "#2c2c2c",
    },
    separator: {
        height: 8,
        // backgroundColor: "#000",
        borderWidth: 1,
        borderColor: "#000",
 
    },
    summarySection: {
        borderTopWidth: 1,
        borderTopColor: COLORS.lightgray,
        paddingTop: 20,
        marginBottom: 20,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    paymentLabel: {
        fontSize: 16,
        fontFamily: FONTS.Medium,
        color: COLORS.black,
    },
    paymentValue: {
        fontSize: 16,
        fontFamily: FONTS.SemiBold,
        color: "red",
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.lightgray,
        padding: 16,
        borderRadius: 12,
    },
    totalLabel: {
        fontSize: 18,
        fontFamily: FONTS.SemiBold,
        color: COLORS.black,
    },
    totalAmount: {
        fontSize: 20,
        fontFamily: FONTS.Bold,
        color: "red",
    },
    button: {
        borderRadius: 15,
        elevation: 5,
        shadowColor: COLORS.black,
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    buttonTouchable: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: COLORS.button,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontFamily: FONTS.Bold,
        letterSpacing: 0.5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    empty: {
        fontSize: 20,
        fontFamily: FONTS.SemiBold,
        color: COLORS.grey,
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        fontFamily: FONTS.Regular,
        color: COLORS.grey,
        textAlign: 'center',
        lineHeight: 20,
    },
    });