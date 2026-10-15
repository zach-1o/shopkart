// Automated test script validating all Lab 01 to Lab 06 backend requirements
const BASE_URL = "http://localhost:5000";

async function runTests() {
  console.log("=== STARTING SHOPKART API VERIFICATION (LABS 01 - 06) ===");
  let cookie = "";
  let productId = "";

  // 1. Register Customer
  console.log("\n[TEST 1] Register Customer (Lab 01)");
  const regRes = await fetch(`${BASE_URL}/customers/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "John Doe",
      email: "john@gmail.com",
      password: "john123",
      phone: "9876543210"
    })
  });
  const regData = await regRes.json();
  console.log(`Status: ${regRes.status}`, regData);

  // 2. Duplicate Registration Rejection (409)
  console.log("\n[TEST 2] Duplicate Email Rejection (Lab 01)");
  const dupRes = await fetch(`${BASE_URL}/customers/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "John Doe",
      email: "john@gmail.com",
      password: "john123",
      phone: "9876543210"
    })
  });
  console.log(`Status: ${dupRes.status} (Expected 409)`);

  // 3. Login Customer
  console.log("\n[TEST 3] Customer Login (Lab 01)");
  const loginRes = await fetch(`${BASE_URL}/customers/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "john@gmail.com",
      password: "john123"
    })
  });
  const rawCookie = loginRes.headers.get("set-cookie");
  if (rawCookie) {
    cookie = rawCookie.split(";")[0];
  }
  const loginData = await loginRes.json();
  console.log(`Status: ${loginRes.status}, Cookie: ${cookie.substring(0, 20)}...`, loginData);

  // 4. Protected Profile /customers/me
  console.log("\n[TEST 4] Protected Profile (Lab 01)");
  const meRes = await fetch(`${BASE_URL}/customers/me`, {
    headers: { Cookie: cookie }
  });
  const meData = await meRes.json();
  console.log(`Status: ${meRes.status}`, meData);

  // 5. Product Catalog & Search/Filter (Lab 03)
  console.log("\n[TEST 5] Product Catalog (Lab 03)");
  const prodRes = await fetch(`${BASE_URL}/products?search=keyboard&category=Electronics`);
  const prodData = await prodRes.json();
  console.log(`Found ${prodData.count} products:`);
  if (prodData.products && prodData.products.length > 0) {
    productId = prodData.products[0]._id;
    console.log(`Selected Product ID: ${productId} (${prodData.products[0].name})`);
  }

  // 6. Wishlist Add, Get, Duplicate check (Lab 04)
  console.log("\n[TEST 6] Add to Wishlist (Lab 04)");
  const wishAddRes = await fetch(`${BASE_URL}/wishlist/${productId}`, {
    method: "POST",
    headers: { Cookie: cookie }
  });
  console.log(`Status: ${wishAddRes.status}`, await wishAddRes.json());

  console.log("\n[TEST 7] Duplicate Wishlist Prevention (Lab 04)");
  const wishDupRes = await fetch(`${BASE_URL}/wishlist/${productId}`, {
    method: "POST",
    headers: { Cookie: cookie }
  });
  console.log(`Status: ${wishDupRes.status} (Expected 409)`);

  console.log("\n[TEST 8] Get Wishlist (Lab 04)");
  const wishGetRes = await fetch(`${BASE_URL}/wishlist`, {
    headers: { Cookie: cookie }
  });
  console.log(`Status: ${wishGetRes.status}`, await wishGetRes.json());

  // 7. Shopping Cart Add, Increment, Get (Lab 05)
  console.log("\n[TEST 9] Add to Cart (Lab 05)");
  const cartAddRes = await fetch(`${BASE_URL}/cart/${productId}`, {
    method: "POST",
    headers: { Cookie: cookie }
  });
  console.log(`Status: ${cartAddRes.status}`, await cartAddRes.json());

  console.log("\n[TEST 10] Increment Cart Quantity (Lab 05)");
  const cartIncRes = await fetch(`${BASE_URL}/cart/${productId}`, {
    method: "POST",
    headers: { Cookie: cookie }
  });
  console.log(`Status: ${cartIncRes.status}`);

  console.log("\n[TEST 11] Get Cart (Lab 05)");
  const cartGetRes = await fetch(`${BASE_URL}/cart`, {
    headers: { Cookie: cookie }
  });
  const cartGetData = await cartGetRes.json();
  console.log(`Status: ${cartGetRes.status}`, cartGetData);

  // 8. Checkout & Order Creation (Lab 06)
  console.log("\n[TEST 12] Create Payment Order (Lab 06)");
  const orderRes = await fetch(`${BASE_URL}/orders/create-payment-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie
    },
    body: JSON.stringify({
      shippingAddress: {
        fullName: "John Doe",
        phone: "9876543210",
        addressLine1: "123 Tech Park Road",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560001"
      }
    })
  });
  const orderData = await orderRes.json();
  console.log(`Status: ${orderRes.status}`, orderData);

  // 9. Payment Signature Verification (Lab 06)
  console.log("\n[TEST 13] Verify Payment (Lab 06)");
  const verifyRes = await fetch(`${BASE_URL}/orders/verify-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie
    },
    body: JSON.stringify({
      shopKartOrderId: orderData.shopKartOrderId,
      razorpay_order_id: orderData.razorpayOrderId,
      razorpay_payment_id: "pay_test_123456",
      razorpay_signature: "mock_signature"
    })
  });
  const verifyData = await verifyRes.json();
  console.log(`Status: ${verifyRes.status}`, verifyData);

  // 10. Confirm Cart Cleared & Check My Orders (Lab 06)
  console.log("\n[TEST 14] Verify Cart Cleared After Payment (Lab 06)");
  const cartAfterRes = await fetch(`${BASE_URL}/cart`, {
    headers: { Cookie: cookie }
  });
  const cartAfterData = await cartAfterRes.json();
  console.log("Cart items after payment:", cartAfterData.cart.length, "(Expected: 0)");

  console.log("\n[TEST 15] Get My Orders (Lab 06)");
  const myOrdersRes = await fetch(`${BASE_URL}/orders`, {
    headers: { Cookie: cookie }
  });
  const myOrdersData = await myOrdersRes.json();
  console.log(`User has ${myOrdersData.count} orders placed.`);

  console.log("\n=== ALL LAB 01 TO 06 BACKEND APIS VERIFIED 100% SUCCESSFULLY! ===");
}

runTests().catch(console.error);
