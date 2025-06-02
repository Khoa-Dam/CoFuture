# CoFuture – Send Messages to the Future

CoFuture enables you to create blockchain-secured time capsules on the Sui Network. Lock personalized messages, SUI tokens, or NFTs to be revealed at a future moment of your choosing. Effortlessly send capsules to yourself or others, ensuring privacy, transparency, and true ownership—your message can only be unlocked at the right time.

## Key Features

- Create secure time capsules containing messages, SUI tokens, or NFTs.
- Set a specific unlock date and time—perfect for surprises, milestones, or special occasions.
- Send capsules to yourself or to any recipient of your choice.
- All capsules are protected by the Sui blockchain, guaranteeing immutability and transparency.

## How It Works

1. **Create a Capsule:** Compose your message or select the SUI tokens/NFTs you want to lock inside a capsule.
2. **Set Unlock Time:** Choose the exact date and time when the capsule can be unlocked.
3. **Send Capsule:** Deliver the capsule either to yourself or to someone else.
4. **Unlock Capsule:** Once the unlock time arrives, the recipient can access the content securely on the blockchain.

## Technology Stack

- **Blockchain:** Sui Network for secure and immutable storage.
- **Smart Contracts:** Manage time-locked capsules.
- **Frontend:**  Vite, react
- **Backend:** Sui blockchain 

## Getting Started
Source built with Next.js for UI: https://github.com/Khoa-Dam/Co-Future-Nextjs
[Instructions to install, run, or contribute]

### Setup Instructions Frontend
1. **Clone the Repository**: Clone the project repository to your local machine.
```bash
git clone https://github.com/Khoa-Dam/CoFuture
```
2. **Navigate to the project folder**
```bash
cd client
```
3. **Install Dependencies**: Use Bun to install the server dependencies.
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```
4. **Run server**: To start the frontend development server, use one of the following
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open [http://localhost:5173/](http://localhost:5173) with your browser to see the result.

## Run Smart contract:
1. **Navigate to the project folder**
 ```bash
cd cofuture
```
2. **Pulish contract**
```bash
sui client publish
```
3. **Copy package and object ID into the env file""
