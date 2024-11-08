# Flash Loan Arbitrage Generator

This web application allows users to generate a Solidity smart contract for executing a flash loan arbitrage. Users can input token pair information and trade route instructions, and the app will generate a smart contract that, when deployed, executes a flash loan to arbitrage trade the provided token pair via the specified route, repays the flash loan, and transfers the profits to the user's wallet—all within the same transaction block.

## User Guide

### 1. Sign In with ZAPT

- Upon visiting the app, users are prompted to sign in using the **Sign in with ZAPT** interface.
- Click on one of the available authentication providers (Google, Facebook, Apple) or use the magic link feature.

### 2. Access the Main Application

- After signing in, users are directed to the main application page.

### 3. Input Token Pair Information

- In the **Generate Smart Contract** section, enter the token pair information in the first text area.
  - Example:
    ```
    Token A: ETH
    Token B: DAI
    ```

### 4. Input Trade Route Instructions

- Enter the trade route instructions in the second text area.
  - Example:
    ```
    Route: Swap ETH to DAI on Uniswap, then swap DAI back to ETH on Sushiswap.
    ```

### 5. Generate Smart Contract

- Click the **Generate Smart Contract** button.
- The app will process the inputs and generate the smart contract code.
- A loading state indicates that the generation is in progress.
- Once complete, the generated Solidity code will be displayed below.

### 6. Review and Use the Smart Contract

- Users can review the generated smart contract code in the displayed code block.
- Copy the code and deploy it using their preferred Ethereum development tools (e.g., Remix, Hardhat).

### Notes

- Ensure that all inputs are accurate to receive a functional smart contract.
- The app includes error handling to inform users if something goes wrong during generation.
- Users can sign out at any time using the **Sign Out** button at the top-right corner.

## External Services Used

- **ZAPT**: Used for user authentication and event handling.
- **Supabase**: Provides authentication services through the Supabase Auth UI.
- **ChatGPT**: Utilized via the `createEvent` function to generate the smart contract code based on user inputs.

## Environment Variables

The following environment variables are required for the app to function correctly:

- `VITE_PUBLIC_APP_ID`: The public application ID for ZAPT integration.
- `VITE_PUBLIC_SENTRY_DSN`: Sentry Data Source Name for error tracking.
- `VITE_PUBLIC_APP_ENV`: The environment (e.g., development, production) for Sentry.

Please ensure these variables are set in your environment or in a `.env` file before running the app.