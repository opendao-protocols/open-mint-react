/** @jsxImportSource @emotion/react */
import React from "react";
import Typography from "@mui/material/Typography";

import { Connector } from "../../../web3";
import { WALLETS } from "../constants";
import { useStyles } from "./styles";

export interface IWalletListProps {
  onLogin: (connector: Connector) => void;
}

export const WalletList: React.FC<IWalletListProps> = ({ onLogin }) => {
  const styles = useStyles();
  // const { Trans } = useTranslation();
  const isOnTestnet = false;

  return (
    <div css={styles.container}>
      {WALLETS.filter(({ mainnetOnly }) => !mainnetOnly || !isOnTestnet).map(
        ({ name, connector, Logo, svgName }) => {
          console.log("LOGO", Logo);
          return (
            <button
              css={styles.getListItem({ isActionable: true })}
              key={`wallet-${name}`}
              type="button"
              onClick={() => onLogin(connector)}
            >
              {/* <div css={styles.walletLogo}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.9426 24L6.96913 28.9691L2 24L6.96913 19.0309L11.9426 24ZM24 11.934L32.5154 20.4537L37.4846 15.4846L24 2L10.5154 15.4846L15.4846 20.4537L24 11.934ZM41.0352 19.0309L36.066 24L41.0352 28.9691L46 24L41.0352 19.0309ZM24 36.066L15.4846 27.5506L10.5154 32.5154L24 46L37.4846 32.5154L32.5154 27.5506L24 36.066ZM24 28.9691L28.9691 24L24 19.0309L19.0309 24L24 28.9691Z"
                    fill="#F0B90B"
                  />
                </svg>
              </div> */}
              {/* <Logo  /> */}
              <img
                src={`./assets/wallets/${svgName}.svg`}
                height="48"
                width="48"
                css={styles.walletLogo}
              />

              <Typography css={styles.walletName} component="span">
                {name}
              </Typography>

              {/* <Icon name="chevronRight" css={[styles.chevronRightIcon]} /> */}
            </button>
          );
        }
      )}

      {/* <div css={styles.divider} />

      {UPCOMING_WALLETS.map(({ name, Logo }) => (
        <div css={styles.getListItem({ isActionable: false })} key={`upcoming-wallet-${name}`}>
          <Logo css={styles.walletLogo} />

          <Typography css={styles.walletName} component="span">
            {name}
          </Typography>

          <Typography css={styles.comingSoonText} component="span">
            {t('authModal.walletList.comingSoon')}
          </Typography>
        </div>
      ))} */}

      {/* <div css={styles.footer}>
        <Typography variant="small2">
          <Trans
            i18nKey="authModal.walletList.termsOfServiceLink"
            components={{
              Anchor: (
                <a // eslint-disable-line jsx-a11y/anchor-has-content
                  href={VENUS_TERMS_OF_SERVICE_URL}
                  target="_blank"
                  rel="noreferrer"
                  css={styles.footerLink}
                />
              ),
            }}
          />
        </Typography>
      </div> */}
    </div>
  );
};
