from solana.rpc.api import Client

# Solana yapılandırması
SOLANA_DEVNET_URL = "https://api.devnet.solana.com"
solana_client = Client(SOLANA_DEVNET_URL)

# Solana işlemi (örnek)
def create_solana_transaction(sender: str, receiver: str, amount: float):
    try:
        response = solana_client.request_airdrop(sender, int(amount * 1e9))  # Airdrop işlemi
        return {"transaction": response}
    except Exception as e:
        return {"error": f"Solana transaction failed: {str(e)}"}
