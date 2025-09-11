import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {COLORS} from '../Constant/Colors';
import BottomTab from './BottomTab';
import SingleEvent from '../Screens/Event/SingleEvent';
import MakeReservation from '../Screens/Reservations/MakeReservation';
import Attending from '../Screens/Attending/Attending';
import LocationView from '../Screens/MapView';
import Gift from '../Screens/Gift';
import Checkout from '../Screens/Checkout';
import CheckoutReservation from '../Screens/Checkout/CheckoutReservation';
import Checkout2 from '../Screens/Checkout/Checkout2';
import SplitBill from '../Screens/Checkout/SplitBill';
import PaymentType from '../Screens/Checkout/PaymentType';
import PaymentCard from '../Screens/Checkout/PaymentCard';
import MyAccount from '../Screens/Profile/MyAccount';
import EditProfile from '../Screens/Profile/EditProfile';
import Settings from '../Screens/Profile/Settings';
import Reviews from '../Screens/Reviews';
import MyEventList from '../Screens/Event/MyEventList';
import MyEventAbout from '../Screens/Event/MyEventAbout';
import MyEventDetails from '../Screens/Event/MyEventDetails';
import Perks from '../Screens/Perks';
import Followers from '../Screens/Profile/Followers';
import GuestLists from '../Screens/Event/GuestLists';
import Receipt from '../Screens/Receipt/Receipt';
import AdditionalOrder from '../Screens/Receipt/AdditionalOrder';
import OrginalOrder from '../Screens/Receipt/OrginalOrder';
import MyTicketAbout from '../Screens/Tickets/MyTicketAbout';
import TicketGuestLists from '../Screens/Tickets/TicketGuestLists';
import SplitBillInvite from '../Screens/SplitBill/SplitBillInvite';
import ContactUs from '../Screens/Tickets/Contactus';
import Help from '../Screens/Tickets/Help';
import ChatList from '../Screens/Message/ChatList';
import SingleChat from '../Screens/Message/SingleChat';
import ViewProfile from '../Screens/Profile/ViewProfile';
import ViewTicket from '../Screens/Tickets/ViewTicket';
import PaymentInfo from '../Screens/Checkout/PaymentInfo';
import MyCheckoutTicket from '../Screens/Tickets/MyCheckoutTicket';
import SplitBillUser from '../Screens/SplitBill/SplitBillUser';
import CheckoutSplitBill from '../Screens/Checkout/CheckoutSplitBill';
import ViewUserProfile from '../Screens/Profile/ViewUserProfile';
import ChangePassword from '../Screens/Profile/ChangePassword';
import MyEventTicketDetails from '../Screens/Event/MyEventTicketDetails';
import MenuBooking from '../Screens/Menu/MenuBooking';
import MenuCheckout from '../Screens/Menu/MenuCheckout';
import ViewOrganizer from '../Screens/Organizer/ViewOrganizer';
import Policies from '../Screens/Policies/Policies';
import ViewSplitBillUser from '../Screens/SplitBill/ViewSplitBillUser';

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {backgroundColor: COLORS.button},
        gestureEnabled: true,
        backgroundColor: COLORS.button,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
      }}
      initialRouteName="BottomTab"
      headerMode="none">
      <Stack.Screen name="BottomTab" component={BottomTab} />
      {/* <Stack.Screen name="MyAccount" component={MyAccount} /> */}
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Followers" component={Followers} />
      <Stack.Screen name="MyEventList" component={MyEventList} />
      <Stack.Screen name="MyEventAbout" component={MyEventAbout} />
      <Stack.Screen name="MyEventDetails" component={MyEventDetails} />
      <Stack.Screen name="GuestLists" component={GuestLists} />
      <Stack.Screen name="Perks" component={Perks} />
      <Stack.Screen name="Reviews" component={Reviews} />
      <Stack.Screen name="SingleEvent" component={SingleEvent} />
      <Stack.Screen name="MakeReservation" component={MakeReservation} />
      <Stack.Screen name="Attending" component={Attending} />
      <Stack.Screen name="LocationView" component={LocationView} />
      <Stack.Screen name="Gift" component={Gift} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="Checkout2" component={Checkout2} />
      <Stack.Screen name="CheckoutSplitBill" component={CheckoutSplitBill} />
      <Stack.Screen name="PaymentType" component={PaymentType} />
      <Stack.Screen name="PaymentCard" component={PaymentCard} />
      <Stack.Screen name="PaymentInfo" component={PaymentInfo} />
      <Stack.Screen name="SplitBill" component={SplitBill} />
      <Stack.Screen name="SplitBillUser" component={SplitBillUser} />
      <Stack.Screen
        name="CheckoutReservation"
        component={CheckoutReservation}
      />
      <Stack.Screen name="Receipt" component={Receipt} />
      <Stack.Screen name="AdditionalOrder" component={AdditionalOrder} />
      <Stack.Screen name="OrginalOrder" component={OrginalOrder} />
      <Stack.Screen name="MyTicketAbout" component={MyTicketAbout} />
      <Stack.Screen name="MyCheckoutTicket" component={MyCheckoutTicket} />
      <Stack.Screen name="TicketGuestLists" component={TicketGuestLists} />
      <Stack.Screen name="SplitBillInvite" component={SplitBillInvite} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="SingleChat" component={SingleChat} />
      <Stack.Screen name="ViewProfile" component={ViewProfile} />
      <Stack.Screen name="ViewTicket" component={ViewTicket} />
      <Stack.Screen name="ViewUserProfile" component={ViewUserProfile} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen
        name="MyEventTicketDetails"
        component={MyEventTicketDetails}
      />
      <Stack.Screen name="MenuBooking" component={MenuBooking} />
      <Stack.Screen name="MenuCheckout" component={MenuCheckout} />
      <Stack.Screen name="ViewOrganizer" component={ViewOrganizer} />
      <Stack.Screen name="Policies" component={Policies} />
      <Stack.Screen name="ViewSplitBillUser" component={ViewSplitBillUser} />
    </Stack.Navigator>
  );
}
