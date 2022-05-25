export const getAuthPayload = ({ address, nonce }) =>
  `Welcome to Upshot!\n\nSign this message to log in.\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nWallet address:\n${address}\n\nNonce:\n${nonce}`
