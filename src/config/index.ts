const validateEnvironmentVariable = (
  name: string,
  value: string | undefined
): string => {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Please check your .env file.`
    );
  }
  return value;
};

export const config = {
  remita: {
    baseUrl: validateEnvironmentVariable(
      "VITE_REMITA_BASE_URL",
      import.meta.env.VITE_REMITA_BASE_URL
    ),
    merchantId: validateEnvironmentVariable(
      "VITE_REMITA_MERCHANT_ID",
      import.meta.env.VITE_REMITA_MERCHANT_ID
    ),
    apiKey: validateEnvironmentVariable(
      "VITE_REMITA_API_KEY",
      import.meta.env.VITE_REMITA_API_KEY
    ),
    serviceTypeId: validateEnvironmentVariable(
      "VITE_REMITA_SERVICE_TYPE_ID",
      import.meta.env.VITE_REMITA_SERVICE_TYPE_ID
    ),
  },
  solana: {
    rpcUrl: validateEnvironmentVariable(
      "VITE_SOLANA_RPC_URL",
      import.meta.env.VITE_SOLANA_RPC_URL
    ),
    usdcMintAddress: validateEnvironmentVariable(
      "VITE_USDC_MINT_ADDRESS",
      import.meta.env.VITE_USDC_MINT_ADDRESS
    ),
    recipientWalletAddress: validateEnvironmentVariable(
      "VITE_RECIPIENT_WALLET_ADDRESS",
      import.meta.env.VITE_RECIPIENT_WALLET_ADDRESS
    ),
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || "Remita Solana Pay",
  },
};
