### Controller (on create)
- generate autho. token

### Controller (on register)
- delete invited doc.

### ON SAVE
- encrypt token

### verify valid token method (to redirect)
<token>
v - decrypt DB token
v - compare decrypted toekn with <token>
v - check if usageTime === 0
v - check if currentTime < authorizationTokenExpiresAt
v -> set usageTime +1
v -> authorizationTokenExpiresAt = currentTime +15min


### verify valid token method (to register)
<token>
v - decrypt DB token
v - compare decrypted toekn with <token>
v - check if usageTime === 1
v - check if currentTime =< authorizationTokenExpiresAt
