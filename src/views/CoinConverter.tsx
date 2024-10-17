function ConvertSlashToDash(symbol: string) {
  const [base, quote] = symbol.split('/');
  return `${quote}-${base}`;
}

function ConvertDashToSlash(symbol: string) {
  const [base, quote] = symbol.split('-');
  return `${quote}/${base}`;
}

function transformCoinData(data: Array<{ coin_name: string; code: string }>) {
  return data.map((coin) => ({
    label: coin.coin_name,
    value: ConvertDashToSlash(coin.code),
  }));
}

function transformMoneyData(str: string): number {
  switch (str) {
    case '10':
      return 1000000000;
    case '5':
      return 500000000;
    case '1':
      return 100000000;
    default:
      return 0;
  }
}

export { ConvertSlashToDash, ConvertDashToSlash, transformCoinData, transformMoneyData };
