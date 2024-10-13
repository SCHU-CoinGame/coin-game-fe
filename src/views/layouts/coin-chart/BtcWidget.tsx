// TradingViewWidget.jsx
import { useEffect, useRef } from 'react';
import { convertToUpbitFormat } from './CoinConverter';

interface BtcKRWProps {
  coin: string;
  toolbarAllowed?: boolean;
}

function BtcWidget(props: BtcKRWProps) {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (container.current) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = `
        {
        "autosize": true,
          "symbol": "${convertToUpbitFormat(props.coin)}",
          "interval": "1",
          "timezone": "Asia/Seoul",
          "theme": "light",
          "hide_legend": true,
          "hide_top_toolbar": ${props.toolbarAllowed ? false : true},
          "style": "1",
          "locale": "kr",
          "allow_symbol_change": false,
          "save_image": false,
          "calendar": false,
          "hide_volume": true,
          "support_host": "https://www.tradingview.com"
        }`;
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: '50%', width: '100%' }}
    ></div>
  );
}

export { BtcWidget };
