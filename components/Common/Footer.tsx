import React from "react";

interface Props {}

export const Footer: React.FC<Props> = ({}) => {
  return (
    <>
      <div id="footer">
        <div
          className="container-fluid"
          style={{ paddingBottom: "0px", backgroundColor: "#0A0A22" }}
        >
          <footer style={{ paddingTop: "16px", paddingBottom: "8px" }}>
            <div className="container footer-height-a">
              <div className="row footer-height">
                <div className="col-lg-5 text-md-left">
                  <div className="row row-height">
                    <div className="col-6">
                      <img
                        src="/assets/img/open-logo-sm.png"
                        // src={logo}
                        alt="defi-deposit-logo-footer"
                        className="img-fluid footer-logo"
                      />
                    </div>
                    <div className="col-6">
                      <p
                        className="revered-rights-b content-description-b"
                        style={{ color: "#fff" }}
                      >
                        © 2021 by OpenDAO
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-6 offset-lg-1 text-center col-12"
                  id="contact"
                >
                  <a href="https://discord.gg/SpFwJRr" target="_blank">
                    <img
                      src="/assets/img/social-media/discord.png"
                      alt="OpenDAO-discord-logo"
                      className="img-fluid social-icons"
                      style={{ maxHeight: "22px" }}
                    />
                  </a>
                  <a href="https://t.me/opendao" target="_blank">
                    <img
                      src="/assets/img/social-media/telegram.png"
                      alt="OpenDAO-telegram-logo"
                      className="img-fluid social-icons"
                    />
                  </a>
                  <a href="https://twitter.com/opendaoprotocol" target="_blank">
                    <img
                      src="/assets/img/social-media/twitter.png"
                      alt="OpenDAO-twitter-logo"
                      className="img-fluid social-icons"
                    />
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCv5O3ANjupSH_yJmdY4o59g"
                    target="_blank"
                  >
                    <img
                      src="/assets/img/social-media/youtube.png"
                      alt="OPenDAO-Youtube-logo"
                      className="img-fluid social-icons"
                      style={{ maxWidth: "23px" }}
                    />
                  </a>
                  <a
                    href="https://v2.info.uniswap.org/token/0x69e8b9528cabda89fe846c67675b5d73d463a916"
                    target="_blank"
                  >
                    <img
                      src="/assets/img/social-media/uniswap.png"
                      style={{ maxHeight: "26px", maxWidth: "30px" }}
                      className="img-fluid social-icons"
                    />
                  </a>
                  <a
                    href="https://www.coingecko.com/en/coins/open-governance-token"
                    target="_blank"
                  >
                    {" "}
                    <img
                      src="/assets/img/social-media/coingecko.png"
                      style={{ maxWidth: "22px" }}
                      className="img-fluid social-icons"
                      alt="OpenDAO-CoinGecko-logo"
                    />
                  </a>
                  <a
                    href="https://exchange.pancakeswap.finance/#/swap?inputCurrency=ETH&outputCurrency=0xabae871b7e3b67aeec6b46ae9fe1a91660aadac5"
                    target="_blank"
                  >
                    <img
                      src="/assets/img/social-media/pancakeswap.png"
                      style={{ maxWidth: "22px" }}
                      className="img-fluid social-icons"
                      alt="OpenDAO-PancakeSwap-logo"
                    />
                  </a>
                  <a
                    href="https://github.com/opendao-protocols"
                    target="_blank"
                  >
                    <img
                      src="/assets/img/social-media/github.png"
                      alt="opendao-github-logo"
                      className="img-fluid social-icons"
                      style={{ maxHeight: "23px" }}
                    />
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};
