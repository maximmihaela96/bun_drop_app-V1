import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardDetails from '../components/CardDetails';
import AdressForm from '../components/AdressForm';

function Payment() {

  const [selectedBurger, setSelectedBurger ] = useState( JSON.parse(localStorage.getItem("selectedBurger")) || []);
  const [selectedFries, setSelectedFries ] = useState(JSON.parse(localStorage.getItem("selectedFries")) || []);
  const [selectedDrinks, setSelectedDrinks] = useState( JSON.parse(localStorage.getItem("selectedDrinks")) || [] );

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");


  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [houseNumber, setHouseNumber] = useState("");

  const [cardDetailsValid, setCardDetailsValid] = useState(false);
  const [deliveryDetailsValid, setDeliveryDetailsValid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const navigate = useNavigate();
  

  function calculateBurgersPrice(burgers) {
    const burgerPrice = burgers.burger.price;
    const quantity = burgers.quantity;
    const burgersPrice = burgerPrice * quantity;
    return burgersPrice;
  }

  function calculateFriesPrice(fries) {
    const friesPrice = fries.price;
    const quantity = fries.quantity;
    const friessPrice = friesPrice * quantity;
    return friessPrice;
  }

  function calculateDrinksPrice(drinks) {
    const drinkPrice = drinks.price;
    const quantity = drinks.quantity;
    const drinksPrice = drinkPrice * quantity;
    return drinksPrice;
  }
  // Calculate total price for burgers
  let burgerTotalPrice = 0;
  if (selectedBurger) {
    burgerTotalPrice = selectedBurger.reduce((total, item) => {
      const burger = item.burger;
      const quantity = item.quantity;
      return total + burger.price * quantity;
    }, 0);
  }
  
  // Calculate total price for fries
  let friesTotalPrice = 0;
  if (selectedFries) {
    friesTotalPrice = selectedFries.reduce((total, fries) => {
      const quantity = fries.quantity; 
      return total + fries.price * quantity;
    }, 0);
  }
  
  // Calculate total price for drinks
  let drinksTotalPrice = 0;
  if (selectedDrinks) {
    drinksTotalPrice = selectedDrinks.reduce((total, drink) => {
      const quantity = drink.quantity; // Assuming drink quantity is always 1
      return total + drink.price * quantity;
    }, 0);
  }
  
  // Calculate the total payment price
  const totalPrice = (burgerTotalPrice + friesTotalPrice + drinksTotalPrice).toFixed(2);

  function handlePlaceOrder() {
    if (cardDetailsValid && deliveryDetailsValid) {

    const order = [...selectedBurger, ...selectedFries, ...selectedDrinks];
    const currentDate = new Date();

    let orderData = {
      totalPrice: totalPrice,
      paymentMethod: paymentMethod, 
      deliveryDate: currentDate,
      order: order,
      adressDetails: {
        firstName: firstName,
        lastName: lastName,
        streetAddress: streetAddress,
        city: city,
        houseNumber: houseNumber,
      },
    };
    if (paymentMethod === 'card') {
      // If payment method is card, include card details
      orderData = {
        ...orderData,
        cardDetails: {
          cardNumber: cardNumber,
          cardName: cardName,
          expiryDate: expiryDate,
          cvv: cvv,
        },
      };
    } else if (paymentMethod === 'swish') {
      // If payment method is Swish, include Swish number
      orderData = {
        ...orderData,
        swishNumber: cardNumber,
      };
    }

    fetch("http://localhost:7000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Order placed successfully:", data);
        // Clear the local storage and reset selected items
        localStorage.clear();
        setSelectedBurger([]);
        setSelectedFries([]);
        setSelectedDrinks([]);

      // Reset the card details inputs
        setCardNumber("");
        setCardName("");
        setExpiryDate("");
        setCvv("");

      // Reset the address details inputs
        setFirstName("");
        setLastName("");
        setStreetAddress("");
        setCity("");
        setHouseNumber("");
        window.alert('Order placed successfully!');
        navigate('/'); // Redirect to the main page
        
      })
      .catch((error) => {
        console.error("Error placing order:", error);
      });
    }else {
      window.alert('Please complete all the inputs. We need all the payment and delivery details before the order be placed! ');
    }
  }

  function cancelOrder() {

    localStorage.clear();
    window.alert('The order was cancelled.');
    navigate('/');
  }

return (
  
<div>
<h2>Order:</h2>

    <h3>Selected Burgers:</h3>
      {selectedBurger.map((item) => {
      const burger = item.burger;
      const quantity = item.quantity;
      return (
        <div key={burger.id}>
          <h5>Name: {burger.name}</h5>
          <p>Price: {burger.price} kr x {quantity}</p>
          <p>Total Price:{calculateBurgersPrice(item).toFixed(2)}kr</p>
        </div>
      );
    })}

    <h3>Selected Fries:</h3>
      {selectedFries.map((fries) => (
          <div key={fries.id}>
            <h5>Name: {fries.name}</h5>
            <p>Price: {fries.price} kr x {fries.quantity}</p>
            <p>Total Price:{calculateFriesPrice(fries).toFixed(2)}kr</p>
          </div>
    ))}

    <h3>Selected Drinks:</h3>
      {selectedDrinks.map((drink) => (
      <div key={drink.id}>
        <h5>Name: {drink.name}</h5>
        <p>Price: {drink.price} kr x {drink.quantity}</p>
          <p>Total Price:{calculateDrinksPrice(drink).toFixed(2)}kr</p>
      </div>
    ))}

    <h4>Total Price: {totalPrice}</h4>

    <div>
      <CardDetails
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          cardName={cardName}
          setCardName={setCardName}
          expiryDate={expiryDate}
          setExpiryDate={setExpiryDate}
          cvv={cvv}
          setCvv={setCvv}
          setPaymentMethod={setPaymentMethod}
          setCardDetailsValid={setCardDetailsValid}
        />
    </div>

    <div>
      <AdressForm
          firstName={firstName} setFirstName={setFirstName}
          lastName={lastName} setLastName={setLastName}
          streetAddress={streetAddress} setStreetAddress={setStreetAddress}
          city={city} setCity={setCity}
          houseNumber={houseNumber} setHouseNumber={setHouseNumber}
          setDeliveryDetailsValid={setDeliveryDetailsValid}
        />
    </div>

      <button type="button" onClick={handlePlaceOrder}>Place Order</button>
      <button type="button" onClick={cancelOrder}>Cancel Order</button>
      //Poput with the price and expire date
</div>

 );   
}
export default Payment
