import "./App.css";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import contractABI from "./contractABI.json";

const contractAddress = 'your_deployed_contract_address';

function App() {
 
	const [account, setAccount] = useState(null);
	const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [NFTContract, setNFTContract] = useState(null);
	const [isMinting, setIsMinting] = useState(false);


  useEffect(() => {
		if (window.ethereum) {
			setIsWalletInstalled(true);
		}
	}, []);

  useEffect(() => {
		function initNFTContract() {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setNFTContract(new Contract(contractAddress,contractABI.abi,signer));
		}
		initNFTContract();
	}, [account]);


  async function connectWallet() {
		window.ethereum
			.request({
				method: "eth_requestAccounts",
			})
			.then((accounts) => {
				setAccount(accounts[0]);
        console.log(accounts[0]);
			})
			.catch((error) => {
				console.log("Something went wrong", error);
			});
	}
 
/*Make sure to change this links to your uploaded images links to Pinata*/
    const data = [
        {
            url: "https://ipfs.io/ipfs/QmaFdAdjpbYUk96n44r6YvnuKFJaa3g6G5UaJC5LVmriBb?filename=bear.png",
            param: "handleMint('https://ipfs.io/ipfs/QmbUBHNaTNuoGeZHRHYKVZCEdkHUPJC1go37iWr2mMyWMc?filename=bear')",
        },
        {
          url: "https://ipfs.io/ipfs/QmPQ1wckc629sd4PoLvsftuPacRxLdN4R1KgwoNMNcJv41?filename=fox.png",
            param: "handleMint('https://ipfs.io/ipfs/QmcS8RPPFZ3tqQkdj15vXCDVdW3kWw5byPi231j4FtNzDp?filename=fox')",
        },
        {
          url: "https://ipfs.io/ipfs/QmQXKXLFd5SPqQtfqmBKHFpU8MFtZqEtQRBkdeGnavsbdJ?filename=dog.png",
            param: "handleMint('https://ipfs.io/ipfs/QmckQwJYrvifnMqjtCTj5Y84yyw24hfGgcQgVAq8shv8Mh?filename=dog')",
        },
        {
          url: "https://ipfs.io/ipfs/QmZyHzhZP15TSA8WBcMoMgzWggB7B1JDJ8hbfvgVViPAiL?filename=cow.png",
            param: "handleMint('https://ipfs.io/ipfs/QmViVZYo3HEuw9aRVU6oyLZXtwxvNskUaagHHL7Mf4R59k?filename=cow')",
        },
        {
          url: "https://ipfs.io/ipfs/QmUFjYPEkvMj4cuKDZVxLYapWNvZxgC1U1yf466D673iFj?filename=lion.png",
            param: "handleMint('https://ipfs.io/ipfs/Qmd8fJ1gxd6puh5HVajJVzd7JZqrqxTNS6mFAkTsB6AEA9?filename=lion')",
        },
    ];

    async function withdrawMoney(){
        try {
 
            const response = await NFTContract.withdrawMoney();
            console.log("Received: ", response);
          } catch (err) {
              console.log(err);
              alert("I think you are not the owner of this contract.")
          }
          
    }

    async function handleMint(tokenURI) {
        setIsMinting(true);
            try {
              const options = {value: ethers.utils.parseEther("0.01")};
              const response = await NFTContract.mintNFT(tokenURI, options);
              console.log("Received: ", response);
            } catch (err) {
                alert(err);
            }
            finally {
              setIsMinting(false);
            }
    }

    if (account === null) {
      return (
        <>
         <div className="container">
           <br/>
          <h1> 🔮 metaschool</h1>
          <h2>NFT Marketplace</h2>
          <p>Buy an NFT from our marketplace.</p>
  
          {isWalletInstalled ? (
            <button onClick={connectWallet}>Connect Wallet</button>
          ) : (
            <p>Install Metamask wallet</p>
          )}
          </div>
          </>
      );
    }

    return (
        <>
            <div className="container">
            <br/>
            <h1> 🔮 metaschool</h1>
          
             <h2>NFT Marketplace</h2>
                {data.map((item, index) => (
                    <div className="imgDiv">
                        <img
                            src={item.url}
                            key={index}
                            alt="images"
                            width={250}
                            height={250}
                        />
                        <button isLoading={isMinting} onClick={() => {
                                eval(item.param);}}> Mint - 0.01 eth </button>
                    </div>
                ))}
                 <button onClick={() => {withdrawMoney();
                }}> Withdraw Money from Contract </button> 
        </div>
        </>
);}

export default App;
