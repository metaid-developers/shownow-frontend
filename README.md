# ShowNow Frontend

ShowNow is a decentralized social platform built on MetaID protocol, enabling users to create, share, and interact with content on the blockchain.

## Features

- 🐦 **Buzz System** - Tweet-like posts with blockchain storage
- 💬 **Comments & Interactions** - Like, repost, and comment on content
- 👥 **Social Graph** - Follow users and build your network
- 🔗 **Wallet Integration** - Connect with Bitcoin wallets
- 🌍 **Internationalization** - Multi-language support (English/Chinese)
- 📊 **Dashboard** - Manage your MetaSo node and fees

## Tech Stack

- **Framework**: [UmiJS](https://umijs.org/)
- **UI Library**: [Ant Design](https://ant.design/)
- **Styling**: Tailwind CSS + Less
- **State Management**: UmiJS Models
- **Blockchain**: MetaID Protocol / Bitcoin

## Documentation

- [English Documentation](README-en.md)
- [中文文档](README-zh.md)

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server (testnet)
pnpm dev

# Start development server (local testnet)
pnpm dev:local

# Start development server (local mainnet)
pnpm dev:localMainnet

# Build for testnet
pnpm build:testnet

# Build for mainnet
pnpm build:mainnet
```

## Project Structure

```
src/
├── Components/    # Reusable UI components
├── pages/         # Page components
├── layouts/       # Layout templates
├── models/        # State management
├── request/       # API layer
├── utils/         # Utility functions
├── locales/       # i18n translations
└── assets/        # Static resources
```

See detailed project structure in:
- [English Version](README-en.md)
- [Chinese Version](README-zh.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Links

- [MetaID Protocol](https://metaid.io)
- [MetaSo](https://metaso.network)
